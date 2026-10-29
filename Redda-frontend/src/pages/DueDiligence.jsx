import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  FileSearch,
  UserCheck,
  Scale,
  Map,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  Search,
  Receipt,
  Building2,
  Waves,
  Leaf,
  Zap,
} from "lucide-react";

import { apiRequest } from "../services/api";

function DueDiligence() {
  const location = useLocation();
  const navigate = useNavigate();

  /*
   * Property selected from PropertySearch page
   */
  const selectedProperty = location.state?.property;

  const [analyzing, setAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState("");

  /*
   * Backend data
   */
  const [dueDiligence, setDueDiligence] = useState(null);
  const [ownership, setOwnership] = useState(null);
  const [taxHistory, setTaxHistory] = useState(null);
  const [permit, setPermit] = useState(null);
  const [zoning, setZoning] = useState(null);
  const [flood, setFlood] = useState(null);
  const [environmental, setEnvironmental] = useState(null);
  const [utility, setUtility] = useState(null);

  /*
   * Due diligence checks
   */
  const [checks, setChecks] = useState([
    {
      title: "Ownership Verification",
      description:
        "Verify current property ownership and ownership history.",
      icon: UserCheck,
      status: "Not analyzed",
      result: "",
    },
    {
      title: "Document Verification",
      description:
        "Analyze property documents for missing or inconsistent information.",
      icon: FileSearch,
      status: "Not analyzed",
      result: "",
    },
    {
      title: "Legal & Compliance",
      description:
        "Identify legal restrictions, permits and compliance issues.",
      icon: Scale,
      status: "Not analyzed",
      result: "",
    },
    {
      title: "Location Analysis",
      description:
        "Analyze zoning, flood risk and environmental information.",
      icon: Map,
      status: "Not analyzed",
      result: "",
    },
  ]);

  /*
   * ---------------------------------------------------------
   * Load backend data
   * ---------------------------------------------------------
   */
  useEffect(() => {
    if (!selectedProperty?.id) {
      return;
    }

    loadDueDiligenceData();
  }, [selectedProperty]);

  const loadDueDiligenceData = async () => {
  try {
    setLoadingData(true);
    setError("");

    const propertyId = selectedProperty.id;

    const results = await Promise.allSettled([
      // Due Diligence
      apiRequest("/api/due-diligence"),

      // Ownership
      apiRequest(
        `/api/ownership-records/property/${propertyId}`
      ),

      // Property Tax
      apiRequest(
        `/api/property-tax-history/property/${propertyId}`
      ),

      // Building Permit
      apiRequest(
        `/api/building-permits/property/${propertyId}`
      ),

      // Zoning
      apiRequest(
        `/api/zoning-information/property/${propertyId}`
      ),

      // Flood Zone
      apiRequest(
        `/api/flood-zone-verification/property/${propertyId}`
      ),

      // Environmental
      apiRequest(
        `/api/environmental-records/property/${propertyId}`
      ),

      // Utility
      apiRequest(
        `/api/utility-information/property/${propertyId}`
      ),
    ]);

    /*
     * ---------------------------------------------------------
     * Due Diligence
     * Backend returns ALL due diligence records.
     * We select the record belonging to this property.
     * ---------------------------------------------------------
     */
    if (results[0].status === "fulfilled") {
      const data = results[0].value;

      if (Array.isArray(data)) {
        const propertyDueDiligence = data.find(
          (item) =>
            Number(item?.property?.id) === Number(propertyId)
        );

        setDueDiligence(propertyDueDiligence || null);
      } else if (
        Number(data?.property?.id) === Number(propertyId)
      ) {
        setDueDiligence(data);
      } else {
        setDueDiligence(null);
      }
    } else {
      setDueDiligence(null);
    }

    /*
     * ---------------------------------------------------------
     * Ownership
     * ---------------------------------------------------------
     */
    if (results[1].status === "fulfilled") {
      const data = results[1].value;

      if (Array.isArray(data)) {
        setOwnership(data.length > 0 ? data[0] : null);
      } else {
        setOwnership(data);
      }
    } else {
      setOwnership(null);
    }

    /*
     * ---------------------------------------------------------
     * Property Tax
     * ---------------------------------------------------------
     */
    if (results[2].status === "fulfilled") {
      const data = results[2].value;

      if (Array.isArray(data)) {
        setTaxHistory(data.length > 0 ? data[0] : null);
      } else {
        setTaxHistory(data);
      }
    } else {
      setTaxHistory(null);
    }

    /*
     * ---------------------------------------------------------
     * Building Permit
     * ---------------------------------------------------------
     */
    if (results[3].status === "fulfilled") {
      const data = results[3].value;

      if (Array.isArray(data)) {
        setPermit(data.length > 0 ? data[0] : null);
      } else {
        setPermit(data);
      }
    } else {
      setPermit(null);
    }

    /*
     * ---------------------------------------------------------
     * Zoning
     * ---------------------------------------------------------
     */
    if (results[4].status === "fulfilled") {
      const data = results[4].value;

      if (Array.isArray(data)) {
        setZoning(data.length > 0 ? data[0] : null);
      } else {
        setZoning(data);
      }
    } else {
      setZoning(null);
    }

    /*
     * ---------------------------------------------------------
     * Flood Zone
     * ---------------------------------------------------------
     */
    if (results[5].status === "fulfilled") {
      const data = results[5].value;

      if (Array.isArray(data)) {
        setFlood(data.length > 0 ? data[0] : null);
      } else {
        setFlood(data);
      }
    } else {
      setFlood(null);
    }

    /*
     * ---------------------------------------------------------
     * Environmental
     * ---------------------------------------------------------
     */
    if (results[6].status === "fulfilled") {
      const data = results[6].value;

      if (Array.isArray(data)) {
        setEnvironmental(
          data.length > 0 ? data[0] : null
        );
      } else {
        setEnvironmental(data);
      }
    } else {
      setEnvironmental(null);
    }

    /*
     * ---------------------------------------------------------
     * Utility
     * ---------------------------------------------------------
     */
    if (results[7].status === "fulfilled") {
      const data = results[7].value;

      if (Array.isArray(data)) {
        setUtility(data.length > 0 ? data[0] : null);
      } else {
        setUtility(data);
      }
    } else {
      setUtility(null);
    }
  } catch (err) {
    console.error(
      "Failed to load due diligence data:",
      err
    );

    setError(
      err.message ||
        "Failed to load due diligence data."
    );
  } finally {
    setLoadingData(false);
  }
};

  /*
   * ---------------------------------------------------------
   * Helper functions
   * ---------------------------------------------------------
   */

  const getArrayFirst = (data) => {
    if (Array.isArray(data)) {
      return data.length > 0 ? data[0] : null;
    }

    return data;
  };

  const getOwnershipName = () => {
    if (!ownership) {
      return "Not available";
    }

    return (
      ownership.ownerName ||
      ownership.owner ||
      ownership.owner_name ||
      "Not available"
    );
  };

  const getOwnershipVerified = () => {
    if (!ownership) {
      return false;
    }

    return (
      ownership.verified === true ||
      ownership.isVerified === true ||
      ownership.verificationStatus === "VERIFIED"
    );
  };

  const getTaxStatus = () => {
    if (!taxHistory) {
      return "Not available";
    }

    return (
      taxHistory.paymentStatus ||
      taxHistory.status ||
      "Not available"
    );
  };

  const getPermitStatus = () => {
    if (!permit) {
      return "Not available";
    }

    return permit.status || "Not available";
  };

  const getZoningStatus = () => {
    if (!zoning) {
      return "Not available";
    }

    return (
      zoning.complianceStatus ||
      zoning.status ||
      "Not available"
    );
  };

  const getFloodRisk = () => {
    if (!flood) {
      return "Not available";
    }

    return (
      flood.riskLevel ||
      flood.riskStatus ||
      flood.verificationStatus ||
      "Not available"
    );
  };

  const getEnvironmentalRisk = () => {
    if (!environmental) {
      return "Not available";
    }

    return (
      environmental.riskLevel ||
      environmental.status ||
      "Not available"
    );
  };

  /*
   * ---------------------------------------------------------
   * Start backend-based analysis
   * ---------------------------------------------------------
   */
  const startAIAnalysis = async () => {
  if (!selectedProperty) {
    alert("Please search and select a property first.");
    navigate("/properties");
    return;
  }

  try {
    setAnalyzing(true);
    setAnalysisComplete(false);
    setError("");

    /*
     * First show analyzing state.
     */
    setChecks((prev) =>
      prev.map((check) => ({
        ...check,
        status: "Analyzing...",
        result: "",
      }))
    );

    /*
     * Refresh backend data before analysis.
     */
    await loadDueDiligenceData();

    /*
     * Mark Due Diligence as COMPLETED in the backend.
     */
    if (dueDiligence?.id && dueDiligence.status !== "COMPLETED") {
      await apiRequest(
        `/api/due-diligence/${dueDiligence.id}/complete`,
        {
          method: "PUT",
        }
      );
    }

    /*
     * Ownership analysis
     */
    const ownershipVerified = getOwnershipVerified();

    /*
     * Tax analysis
     */
    const taxStatus = getTaxStatus();

    /*
     * Permit analysis
     */
    const permitStatus = getPermitStatus();

    /*
     * Zoning analysis
     */
    const zoningStatus = getZoningStatus();

    /*
     * Flood analysis
     */
    const floodRisk = getFloodRisk();

    /*
     * Environmental analysis
     */
    const environmentalRisk = getEnvironmentalRisk();

    /*
     * Ownership result
     */
    let ownershipCheck;

    if (ownershipVerified) {
      ownershipCheck = {
        title: "Ownership Verification",
        description:
          "Verify current property ownership and ownership history.",
        icon: UserCheck,
        status: "Completed",
        result: `Ownership verified for ${getOwnershipName()}.`,
      };
    } else if (ownership) {
      ownershipCheck = {
        title: "Ownership Verification",
        description:
          "Verify current property ownership and ownership history.",
        icon: UserCheck,
        status: "Warning",
        result: `Ownership record found for ${getOwnershipName()}, but verification is required.`,
      };
    } else {
      ownershipCheck = {
        title: "Ownership Verification",
        description:
          "Verify current property ownership and ownership history.",
        icon: UserCheck,
        status: "Warning",
        result: "No ownership record is available for this property.",
      };
    }

    /*
     * Document result
     */
    let documentCheck;

    if (
      taxHistory ||
      permit ||
      environmental ||
      utility
    ) {
      documentCheck = {
        title: "Document Verification",
        description:
          "Analyze property documents for missing or inconsistent information.",
        icon: FileSearch,
        status: "Completed",
        result:
          "Property supporting records were received from the backend.",
      };
    } else {
      documentCheck = {
        title: "Document Verification",
        description:
          "Analyze property documents for missing or inconsistent information.",
        icon: FileSearch,
        status: "Warning",
        result:
          "Supporting property documents are not available.",
      };
    }

    /*
     * Legal / compliance result
     */
    const permitGood =
      permitStatus === "ACTIVE" ||
      permitStatus === "COMPLIANT" ||
      permitStatus === "VALID";

    const zoningGood =
      zoningStatus === "COMPLIANT" ||
      zoningStatus === "VALID";

    let legalCheck;

    if (permitGood && zoningGood) {
      legalCheck = {
        title: "Legal & Compliance",
        description:
          "Identify legal restrictions, permits and compliance issues.",
        icon: Scale,
        status: "Completed",
        result:
          "Permit and zoning records indicate compliance.",
      };
    } else {
      legalCheck = {
        title: "Legal & Compliance",
        description:
          "Identify legal restrictions, permits and compliance issues.",
        icon: Scale,
        status: "Warning",
        result: `Permit status: ${permitStatus}. Zoning status: ${zoningStatus}.`,
      };
    }

    /*
     * Location result
     */
    const floodGood =
      String(floodRisk).toUpperCase() === "LOW" ||
      String(floodRisk).toUpperCase() === "VERIFIED";

    const environmentGood =
      String(environmentalRisk).toUpperCase() === "LOW" ||
      String(environmentalRisk).toUpperCase() === "VERIFIED";

    let locationCheck;

    if (floodGood && environmentGood) {
      locationCheck = {
        title: "Location Analysis",
        description:
          "Analyze zoning, flood risk and environmental information.",
        icon: Map,
        status: "Completed",
        result:
          "Flood and environmental records indicate low risk.",
      };
    } else {
      locationCheck = {
        title: "Location Analysis",
        description:
          "Analyze zoning, flood risk and environmental information.",
        icon: Map,
        status: "Warning",
        result: `Flood risk: ${floodRisk}. Environmental risk: ${environmentalRisk}.`,
      };
    }

    /*
     * Small delay only for visual UX.
     * Actual information comes from backend.
     */
    await new Promise((resolve) => setTimeout(resolve, 500));

    setChecks([
      ownershipCheck,
      documentCheck,
      legalCheck,
      locationCheck,
    ]);

    setAnalyzing(false);
    setAnalysisComplete(true);

  } catch (err) {
    console.error("Due diligence analysis failed:", err);

    setAnalyzing(false);

    setChecks((prev) =>
      prev.map((check) => ({
        ...check,
        status: "Warning",
        result: "Unable to complete this check.",
      }))
    );

    setError(err.message || "Due diligence analysis failed.");
  }
};

  /*
   * ---------------------------------------------------------
   * Status UI
   * ---------------------------------------------------------
   */

  const getStatusIcon = (status) => {
    if (status === "Completed") {
      return (
        <CheckCircle
          size={18}
          className="text-green-600"
        />
      );
    }

    if (status === "Warning") {
      return (
        <AlertTriangle
          size={18}
          className="text-orange-500"
        />
      );
    }

    if (status === "Analyzing...") {
      return (
        <Loader2
          size={18}
          className="text-blue-500 animate-spin"
        />
      );
    }

    if (status === "Failed") {
      return (
        <XCircle
          size={18}
          className="text-red-500"
        />
      );
    }

    return (
      <Clock
        size={18}
        className="text-gray-400"
      />
    );
  };

  const getStatusColor = (status) => {
    if (status === "Completed") {
      return "bg-green-100 text-green-700";
    }

    if (status === "Warning") {
      return "bg-orange-100 text-orange-700";
    }

    if (status === "Analyzing...") {
      return "bg-blue-100 text-blue-700";
    }

    if (status === "Failed") {
      return "bg-red-100 text-red-700";
    }

    return "bg-gray-100 text-gray-500";
  };

  /*
   * ---------------------------------------------------------
   * No property selected
   * ---------------------------------------------------------
   */

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed bg-no-repeat"
      style={{
        backgroundImage: "url('/p2.png')",
      }}
    >
      <div className="relative z-10 p-2">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-green-100 flex items-center justify-center">
              <ShieldCheck
                className="text-green-600"
                size={24}
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Due Diligence
              </h1>

              <p className="mt-1 text-gray-500">
                Perform a complete property risk investigation.
              </p>
            </div>
          </div>
        </div>

        {/* SELECTED PROPERTY */}
        <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
          <p className="text-sm text-gray-500">
            Selected Property
          </p>

          {selectedProperty ? (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-2">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {selectedProperty.address}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {selectedProperty.propertyType ||
                    selectedProperty.type ||
                    "Property"}{" "}
                  • Property ID: {selectedProperty.id}
                </p>

                {selectedProperty.price && (
                  <p className="text-sm text-gray-500 mt-1">
                    Price: ₹
                    {Number(
                      selectedProperty.price
                    ).toLocaleString("en-IN")}
                  </p>
                )}
              </div>

              <button
                onClick={() => navigate("/properties")}
                className="flex items-center justify-center gap-2 border border-green-600 text-green-600 hover:bg-green-50 px-5 py-3 rounded-lg font-medium transition"
              >
                <Search size={18} />
                Change Property
              </button>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-2">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  No property selected
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Search for a property before starting due diligence.
                </p>
              </div>

              <button
                onClick={() => navigate("/properties")}
                className="flex items-center justify-center gap-2 border border-green-600 text-green-600 hover:bg-green-50 px-5 py-3 rounded-lg font-medium transition"
              >
                Search Property
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 flex gap-3 bg-red-50 border border-red-200 rounded-xl p-5">
            <XCircle
              className="text-red-500 flex-shrink-0"
              size={22}
            />

            <div>
              <h3 className="font-semibold text-red-800">
                Backend Request Error
              </h3>

              <p className="text-sm text-red-700 mt-1">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* BACKEND DATA SUMMARY */}
        {selectedProperty && (
          <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <ShieldCheck
                  className="text-blue-600"
                  size={22}
                />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Backend Property Records
                </h2>

                <p className="text-sm text-gray-500">
                  Live due diligence records received from the backend.
                </p>
              </div>
            </div>

            {loadingData ? (
              <div className="flex items-center gap-2 text-blue-600">
                <Loader2
                  size={20}
                  className="animate-spin"
                />
                Loading backend records...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* OWNERSHIP */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <UserCheck
                      size={18}
                      className="text-blue-600"
                    />

                    <p className="font-medium text-gray-700">
                      Ownership
                    </p>
                  </div>

                  <p className="text-sm text-gray-500">
                    {getOwnershipName()}
                  </p>

                  <p
                    className={`text-sm font-semibold mt-2 ${
                      getOwnershipVerified()
                        ? "text-green-600"
                        : "text-orange-600"
                    }`}
                  >
                    {getOwnershipVerified()
                      ? "VERIFIED"
                      : "NOT VERIFIED"}
                  </p>
                </div>

                {/* TAX */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Receipt
                      size={18}
                      className="text-blue-600"
                    />

                    <p className="font-medium text-gray-700">
                      Property Tax
                    </p>
                  </div>

                  <p className="text-sm text-gray-500">
                    {taxHistory
                      ? taxHistory.taxYear || "Record available"
                      : "No record"}
                  </p>

                  <p className="text-sm font-semibold mt-2">
                    {getTaxStatus()}
                  </p>
                </div>

                {/* PERMIT */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2
                      size={18}
                      className="text-blue-600"
                    />

                    <p className="font-medium text-gray-700">
                      Building Permit
                    </p>
                  </div>

                  <p className="text-sm text-gray-500">
                    {permit?.permitNumber ||
                      "Record available"}
                  </p>

                  <p className="text-sm font-semibold mt-2">
                    {getPermitStatus()}
                  </p>
                </div>

                {/* ZONING */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Map
                      size={18}
                      className="text-blue-600"
                    />

                    <p className="font-medium text-gray-700">
                      Zoning
                    </p>
                  </div>

                  <p className="text-sm text-gray-500">
                    {zoning?.zoningType ||
                      "Record available"}
                  </p>

                  <p className="text-sm font-semibold mt-2">
                    {getZoningStatus()}
                  </p>
                </div>

                {/* FLOOD */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Waves
                      size={18}
                      className="text-blue-600"
                    />

                    <p className="font-medium text-gray-700">
                      Flood Zone
                    </p>
                  </div>

                  <p className="text-sm text-gray-500">
                    {flood?.zone ||
                      "Record available"}
                  </p>

                  <p className="text-sm font-semibold mt-2">
                    {getFloodRisk()}
                  </p>
                </div>

                {/* ENVIRONMENTAL */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Leaf
                      size={18}
                      className="text-green-600"
                    />

                    <p className="font-medium text-gray-700">
                      Environmental
                    </p>
                  </div>

                  <p className="text-sm text-gray-500">
                    {environmental?.recordType ||
                      "Record available"}
                  </p>

                  <p className="text-sm font-semibold mt-2">
                    {getEnvironmentalRisk()}
                  </p>
                </div>

                {/* UTILITY */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap
                      size={18}
                      className="text-yellow-600"
                    />

                    <p className="font-medium text-gray-700">
                      Utility
                    </p>
                  </div>

                  <p className="text-sm text-gray-500">
                    {utility?.utilityType ||
                      "Record available"}
                  </p>

                  <p className="text-sm font-semibold mt-2">
                    {utility?.status ||
                      "Not available"}
                  </p>
                </div>

                {/* DUE DILIGENCE */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck
                      size={18}
                      className="text-green-600"
                    />

                    <p className="font-medium text-gray-700">
                      Due Diligence
                    </p>
                  </div>

                  <p className="text-sm text-gray-500">
                    {dueDiligence
                      ? "Record available"
                      : "Not created"}
                  </p>

                  <p className="text-sm font-semibold mt-2">
                    {dueDiligence?.status ||
                      "NOT STARTED"}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* BACKEND ANALYSIS */}
        <div className="bg-slate-900 rounded-xl p-6 text-white mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Sparkles
                className="text-green-400"
                size={24}
              />
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                Due Diligence Analysis
              </h2>

              <p className="text-sm text-slate-400 mt-1">
                REDDA analyzes property records received from
                the backend.
              </p>
            </div>
          </div>

          <button
            onClick={startAIAnalysis}
            disabled={
              analyzing ||
              loadingData ||
              !selectedProperty
            }
            className="mt-6 flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-5 py-3 rounded-lg font-medium transition"
          >
            {analyzing ? (
              <>
                <Loader2
                  size={19}
                  className="animate-spin"
                />
                Analyzing Backend Data...
              </>
            ) : (
              <>
                <Sparkles size={19} />

                {analysisComplete
                  ? "Run Analysis Again"
                  : "Start Due Diligence Analysis"}

                <ArrowRight size={18} />
              </>
            )}
          </button>

          {analyzing && (
            <div className="mt-5">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-300">
                  Processing property records...
                </span>

                <span className="text-green-400">
                  Processing
                </span>
              </div>

              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full animate-pulse w-3/4" />
              </div>
            </div>
          )}
        </div>

        {/* SUMMARY */}
        {analysisComplete && (
          <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <AlertTriangle
                  className="text-orange-500"
                  size={22}
                />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Due Diligence Summary
                </h2>

                <p className="text-sm text-gray-500">
                  Summary generated from backend property records.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500">
                  Overall Risk
                </p>

                <p className="text-2xl font-bold text-orange-500 mt-1">
                  {selectedProperty?.riskLevel ||
                    "Based on Records"}
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500">
                  Checks Completed
                </p>

                <p className="text-2xl font-bold text-green-600 mt-1">
                  {
                    checks.filter(
                      (check) =>
                        check.status === "Completed"
                    ).length
                  }{" "}
                  / {checks.length}
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-500">
                  Potential Issues
                </p>

                <p className="text-2xl font-bold text-red-600 mt-1">
                  {
                    checks.filter(
                      (check) =>
                        check.status === "Warning"
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* DUE DILIGENCE CHECKS */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Due Diligence Checks
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              These results are based on records retrieved from
              your backend.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {checks.map((check) => {
              const Icon = check.icon;

              return (
                <div
                  key={check.title}
                  className="border rounded-xl p-5 hover:shadow-sm transition"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Icon
                        size={21}
                        className="text-gray-600"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <h3 className="font-semibold text-gray-800">
                          {check.title}
                        </h3>

                        <span
                          className={`w-fit flex items-center gap-1 text-xs px-2.5 py-1 rounded-full ${getStatusColor(
                            check.status
                          )}`}
                        >
                          {getStatusIcon(check.status)}

                          {check.status}
                        </span>
                      </div>

                      <p className="text-sm text-gray-500 mt-1">
                        {check.description}
                      </p>

                      {check.result && (
                        <div className="mt-4 bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">
                              Backend Finding:
                            </span>{" "}
                            {check.result}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* IMPORTANT */}
        <div className="mt-6 flex gap-3 bg-orange-50 border border-orange-200 rounded-xl p-5">
          <AlertTriangle
            className="text-orange-500 flex-shrink-0"
            size={22}
          />

          <div>
            <h3 className="font-semibold text-orange-800">
              Important
            </h3>

            <p className="text-sm text-orange-700 mt-1">
              These findings are based on the property records
              currently available in the REDDA backend. Always
              verify important information against official
              property records and legal documents before making
              a final investment decision.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DueDiligence;