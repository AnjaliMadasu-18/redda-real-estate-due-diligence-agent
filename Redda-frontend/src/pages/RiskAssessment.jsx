import { useEffect, useState } from "react";

import {
  ShieldAlert,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Info,
  ArrowRight,
} from "lucide-react";

function RiskAssessment() {
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [error, setError] = useState("");

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [riskData, setRiskData] = useState(null);

  /*
   * Get selected property from localStorage.
   * Different pages may store the property using different keys,
   * so we check the commonly used keys.
   */
  const getStoredProperty = () => {
    const keys = [
      "selectedProperty",
      "reddaSelectedProperty",
      "property",
      "reddaProperty",
    ];

    for (const key of keys) {
      const value = localStorage.getItem(key);

      if (value) {
        try {
          const parsed = JSON.parse(value);

          if (parsed && typeof parsed === "object") {
            return parsed;
          }
        } catch (error) {
          console.log(`Unable to parse ${key}`);
        }
      }
    }

    return null;
  };

  /*
   * Get property ID.
   */
  const getPropertyId = () => {
    const property = getStoredProperty();

    if (property?.id) {
      return property.id;
    }

    const savedId = localStorage.getItem("reddaPropertyId");

    if (savedId) {
      return savedId;
    }

    /*
     * Your currently tested backend property is ID 3.
     * This is only a fallback if no property has been selected.
     */
    return 3;
  };

  /*
   * Load selected property information.
   */
  const loadSelectedProperty = () => {
    const property = getStoredProperty();

    if (property) {
      setSelectedProperty(property);
    } else {
      setSelectedProperty({
        id: getPropertyId(),
        address: "Hyderabad, Telangana",
        propertyType: "Residential",
        price: 8000000,
      });
    }
  };

  /*
   * Get JWT token.
   */
  const getToken = () => {
    return localStorage.getItem("reddaToken");
  };

  /*
   * Fetch Risk Assessment from Spring Boot backend.
   */
  const loadRiskAssessment = async () => {
    try {
      setError("");

      const propertyId = getPropertyId();
      const token = getToken();

      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(
        `http://localhost:8080/api/risk-assessments/property/${propertyId}`,
        {
          method: "GET",
          headers,
        }
      );

      if (!response.ok) {
        let message = "Unable to load risk assessment.";

        try {
          const errorData = await response.json();

          if (errorData?.message) {
            message = errorData.message;
          }
        } catch (error) {
          // Ignore JSON parsing error
        }

        throw new Error(message);
      }

      const data = await response.json();

      console.log("Risk Assessment received from backend:", data);

      setRiskData(data);
      setAnalyzed(true);
    } catch (error) {
      console.error("Risk Assessment API error:", error);

      setRiskData(null);
      setAnalyzed(false);
      setError(error.message || "Unable to connect to backend.");
    }
  };

  /*
   * Load property and risk data when page opens.
   */
  useEffect(() => {
    loadSelectedProperty();
    loadRiskAssessment();
  }, []);

  /*
   * Run / refresh risk analysis.
   */
  const handleAnalysis = async () => {
    try {
      setAnalyzing(true);
      setError("");

      /*
       * Small delay so the user can see the analysing state.
       */
      await new Promise((resolve) => setTimeout(resolve, 500));

      await loadRiskAssessment();

      setAnalyzing(false);
    } catch (error) {
      console.error("Risk analysis failed:", error);

      setAnalyzing(false);
      setError(error.message || "Risk analysis failed.");
    }
  };

  /*
   * Convert backend risk value to display format.
   */
  const formatRiskLevel = (value) => {
    if (!value) {
      return "UNKNOWN";
    }

    return String(value).toUpperCase();
  };

  /*
   * Convert backend risk level to numeric score for category display.
   */
  const getCategoryScore = (level) => {
    const value = formatRiskLevel(level);

    if (value === "LOW") {
      return 20;
    }

    if (value === "MEDIUM") {
      return 50;
    }

    if (value === "HIGH") {
      return 80;
    }

    if (value === "UNKNOWN") {
      return 10;
    }

    return 0;
  };

  /*
   * Risk category style.
   */
  const getRiskStyle = (level) => {
    const value = formatRiskLevel(level);

    if (value === "LOW") {
      return {
        badge: "bg-green-100 text-green-700",
        icon: "text-green-600",
      };
    }

    if (value === "MEDIUM") {
      return {
        badge: "bg-yellow-100 text-yellow-700",
        icon: "text-yellow-600",
      };
    }

    if (value === "HIGH") {
      return {
        badge: "bg-red-100 text-red-700",
        icon: "text-red-600",
      };
    }

    return {
      badge: "bg-gray-100 text-gray-700",
      icon: "text-gray-600",
    };
  };

  /*
   * Build risk categories directly from backend response.
   */
  const risks = riskData
    ? [
        {
          title: "Ownership Risk",
          level: formatRiskLevel(riskData.ownershipRisk),
          score: getCategoryScore(riskData.ownershipRisk),
          description:
            "Risk associated with property ownership verification and ownership records.",
        },

        {
          title: "Tax Risk",
          level: formatRiskLevel(riskData.taxRisk),
          score: getCategoryScore(riskData.taxRisk),
          description:
            "Risk associated with property tax history and outstanding tax obligations.",
        },

        {
          title: "Legal Risk",
          level: formatRiskLevel(riskData.legalRisk),
          score: getCategoryScore(riskData.legalRisk),
          description:
            "Risk associated with legal records and potential legal issues.",
        },

        {
          title: "Permit Risk",
          level: formatRiskLevel(riskData.permitRisk),
          score: getCategoryScore(riskData.permitRisk),
          description:
            "Risk associated with building permits and permit compliance.",
        },

        {
          title: "Zoning Risk",
          level: formatRiskLevel(riskData.zoningRisk),
          score: getCategoryScore(riskData.zoningRisk),
          description:
            "Risk associated with zoning information and zoning compliance.",
        },

        {
          title: "Flood Risk",
          level: formatRiskLevel(riskData.floodRisk),
          score: getCategoryScore(riskData.floodRisk),
          description:
            "Risk associated with flood zone verification and flood exposure.",
        },
      ]
    : [];

  /*
   * Get overall risk.
   */
  const overallRisk = riskData
    ? formatRiskLevel(riskData.overallRisk)
    : "UNKNOWN";

  /*
   * Get overall score.
   */
  const riskScore = riskData?.riskScore ?? 0;

  /*
   * Overall risk text style.
   */
  const getOverallRiskClass = () => {
    if (overallRisk === "LOW") {
      return "text-green-600";
    }

    if (overallRisk === "MEDIUM") {
      return "text-orange-500";
    }

    if (overallRisk === "HIGH") {
      return "text-red-600";
    }

    return "text-gray-600";
  };

  /*
   * Property display values.
   */
  const propertyAddress =
    selectedProperty?.address || "Property address unavailable";

  const propertyType =
    selectedProperty?.propertyType || "Property type unavailable";

  const propertyPrice = selectedProperty?.price;

  const formattedPrice =
    propertyPrice !== undefined && propertyPrice !== null
      ? `₹${Number(propertyPrice).toLocaleString("en-IN")}`
      : "Price unavailable";

  return (
    <div
      className="relative w-full min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        backgroundImage: "url('/p2.png')",
      }}
    >
      <div className="relative z-10 w-full min-h-screen p-2 md:p-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-red-100 flex items-center justify-center">
              <ShieldAlert
                size={24}
                className="text-red-600"
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Risk Assessment
              </h1>

              <p className="mt-1 text-gray-500">
                Identify and evaluate potential risks associated with a
                property.
              </p>
            </div>
          </div>
        </div>

        {/* Selected Property */}
        <div className="bg-white border rounded-xl shadow-sm p-6 mb-6">
          <p className="text-sm text-gray-500">
            Property Under Assessment
          </p>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-2">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {propertyAddress}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {propertyType}
                {selectedProperty?.id
                  ? ` • Property ID: ${selectedProperty.id}`
                  : ""}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Price: {formattedPrice}
              </p>
            </div>

            <span className="w-fit bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">
              Backend Data
            </span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex gap-3">
              <AlertTriangle
                size={22}
                className="text-red-600 flex-shrink-0"
              />

              <div>
                <h3 className="font-semibold text-red-800">
                  Unable to load risk assessment
                </h3>

                <p className="text-sm text-red-700 mt-1">
                  {error}
                </p>

                <p className="text-sm text-red-700 mt-2">
                  Please make sure your Spring Boot backend is running on
                  port 8080.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* AI Risk Analysis */}
        <div className="bg-slate-900 rounded-xl p-6 text-white mb-6">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
              <Sparkles
                size={24}
                className="text-green-400"
              />
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-semibold">
                AI Risk Analysis
              </h2>

              <p className="text-sm text-slate-400 mt-1">
                REDDA AI evaluates property risk information received
                directly from the backend.
              </p>

              <button
                onClick={handleAnalysis}
                disabled={analyzing}
                className="mt-5 flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 px-5 py-3 rounded-lg font-medium transition"
              >
                <Sparkles size={18} />

                {analyzing
                  ? "Loading Risk Data..."
                  : analyzed
                  ? "Refresh Risk Analysis"
                  : "Start AI Risk Analysis"}

                {!analyzing && <ArrowRight size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Overall Risk */}
        {analyzed && riskData && (
          <div className="bg-white border rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div>
                <p className="text-sm text-gray-500">
                  Overall Property Risk
                </p>

                <h2
                  className={`text-4xl font-bold mt-2 ${getOverallRiskClass()}`}
                >
                  {overallRisk} Risk
                </h2>

                <p className="text-sm text-gray-500 mt-2">
                  Risk assessment received from the backend.
                </p>

                {riskData.summary && (
                  <p className="text-sm text-gray-600 mt-2 max-w-xl">
                    {riskData.summary}
                  </p>
                )}
              </div>

              <div className="w-full md:w-64">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">
                    Risk Score
                  </span>

                  <span className="font-semibold text-gray-700">
                    {riskScore} / 100
                  </span>
                </div>

                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      overallRisk === "HIGH"
                        ? "bg-red-500"
                        : overallRisk === "MEDIUM"
                        ? "bg-orange-500"
                        : "bg-green-500"
                    }`}
                    style={{
                      width: `${Math.min(Math.max(riskScore, 0), 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Risk Categories */}
        <div className="bg-white border rounded-xl shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Risk Categories
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Risk assessment values received from the backend.
            </p>
          </div>

          {!riskData && !error && (
            <div className="text-center py-10">
              <p className="text-gray-500">
                Loading risk assessment data...
              </p>
            </div>
          )}

          {riskData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {risks.map((risk) => {
                const style = getRiskStyle(risk.level);

                return (
                  <div
                    key={risk.title}
                    className="border rounded-xl p-5 hover:shadow-sm transition"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <ShieldAlert
                          size={22}
                          className={style.icon}
                        />

                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {risk.title}
                          </h3>

                          <p className="text-sm text-gray-500 mt-1">
                            {risk.description}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-xs px-3 py-1 rounded-full ${style.badge}`}
                      >
                        {risk.level}
                      </span>
                    </div>

                    <div className="mt-5">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-500">
                          Risk Indicator
                        </span>

                        <span className="font-semibold text-gray-700">
                          {risk.level}
                        </span>
                      </div>

                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            risk.level === "HIGH"
                              ? "bg-red-500"
                              : risk.level === "MEDIUM"
                              ? "bg-orange-500"
                              : risk.level === "LOW"
                              ? "bg-green-500"
                              : "bg-gray-500"
                          }`}
                          style={{
                            width: `${risk.score}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Backend Summary */}
        {analyzed && riskData && (
          <div className="mt-6 bg-white border rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <CheckCircle
                size={22}
                className="text-green-600"
              />

              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Backend Risk Findings
                </h2>

                <p className="text-sm text-gray-500">
                  Risk information received from your Spring Boot backend.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
                <CheckCircle
                  size={20}
                  className="text-green-600 flex-shrink-0"
                />

                <p className="text-sm text-green-800">
                  Risk assessment data was successfully received from the
                  backend.
                </p>
              </div>

              {riskData.summary && (
                <div className="flex gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <Info
                    size={20}
                    className="text-blue-600 flex-shrink-0"
                  />

                  <p className="text-sm text-blue-800">
                    <strong>Backend Summary:</strong>{" "}
                    {riskData.summary}
                  </p>
                </div>
              )}

              {overallRisk === "HIGH" && (
                <div className="flex gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
                  <AlertTriangle
                    size={20}
                    className="text-red-600 flex-shrink-0"
                  />

                  <p className="text-sm text-red-800">
                    The backend has identified a high overall property
                    risk. Further investigation is recommended.
                  </p>
                </div>
              )}

              {overallRisk === "MEDIUM" && (
                <div className="flex gap-3 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <Info
                    size={20}
                    className="text-yellow-600 flex-shrink-0"
                  />

                  <p className="text-sm text-yellow-800">
                    The backend has identified a medium overall property
                    risk. Additional verification may be required.
                  </p>
                </div>
              )}

              {overallRisk === "LOW" && (
                <div className="flex gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
                  <CheckCircle
                    size={20}
                    className="text-green-600 flex-shrink-0"
                  />

                  <p className="text-sm text-green-800">
                    The backend has identified a low overall property
                    risk based on the available assessment data.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-6 bg-orange-50 border border-orange-200 rounded-xl p-5">
          <div className="flex gap-3">
            <AlertTriangle
              size={22}
              className="text-orange-500 flex-shrink-0"
            />

            <div>
              <h3 className="font-semibold text-orange-800">
                Important
              </h3>

              <p className="text-sm text-orange-700 mt-1">
                Risk assessments are based on property records currently
                available in the REDDA backend. Always verify important
                information using official property records and qualified
                professional advice before making financial or legal
                decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RiskAssessment;