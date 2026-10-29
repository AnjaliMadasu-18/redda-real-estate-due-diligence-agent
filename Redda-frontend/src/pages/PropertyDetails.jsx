import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  MapPin,
  Home,
  User,
  FileText,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Ruler,
  Building2,
  Landmark,
  Gavel,
  Receipt,
  Search,
  ExternalLink,
  Loader2,
} from "lucide-react";

/* =========================================================
   API CONFIGURATION
   ========================================================= */

const API_BASE_URL = "http://localhost:8080";

const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("reddaToken");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const responseText = await response.text();

  let data = null;

  try {
    data = responseText ? JSON.parse(responseText) : null;
  } catch {
    data = responseText;
  }

  if (!response.ok) {
    const message =
      typeof data === "object" && data?.message
        ? data.message
        : typeof data === "string" && data
        ? data
        : `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return data;
};

/* =========================================================
   PROPERTY DETAILS
   ========================================================= */

function PropertyDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  /*
   * Property selected from Property Search page.
   */
  const selectedProperty = location.state?.property;

  const [activeTab, setActiveTab] = useState("overview");

  const [property, setProperty] = useState(null);
  const [ownership, setOwnership] = useState(null);
  const [propertyHistory, setPropertyHistory] = useState([]);
  const [riskAssessment, setRiskAssessment] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD DATA FROM BACKEND
     ========================================================= */

  useEffect(() => {
    const loadPropertyData = async () => {
      try {
        setLoading(true);
        setError("");

        /*
         * First try the property passed from search page.
         */
        let propertyId = selectedProperty?.id;

        /*
         * If there is no property ID in navigation state,
         * try to read it from the URL query parameter.
         */
        if (!propertyId) {
          const params = new URLSearchParams(location.search);
          propertyId = params.get("id");
        }

        if (!propertyId) {
          throw new Error(
            "Property ID is missing. Please search for a property again."
          );
        }

        /* ---------------------------------------------
           1. PROPERTY
           --------------------------------------------- */

        const propertyData = await apiRequest(
          `/api/properties/${propertyId}`
        );

        setProperty(propertyData);

        /* ---------------------------------------------
           2. OWNERSHIP
           --------------------------------------------- */

        try {
          const ownershipData = await apiRequest(
            `/api/ownership-records/property/${propertyId}`
          );

          if (Array.isArray(ownershipData)) {
            setOwnership(ownershipData[0] || null);
          } else {
            setOwnership(ownershipData);
          }
        } catch (ownershipError) {
          console.log(
            "Ownership information could not be loaded:",
            ownershipError.message
          );

          setOwnership(null);
        }

        /* ---------------------------------------------
           3. PROPERTY HISTORY
           --------------------------------------------- */

        try {
          const historyData = await apiRequest(
            `/api/property-history/property/${propertyId}`
          );

          setPropertyHistory(
            Array.isArray(historyData) ? historyData : []
          );
        } catch (historyError) {
          console.log(
            "Property history could not be loaded:",
            historyError.message
          );

          setPropertyHistory([]);
        }

        /* ---------------------------------------------
           4. RISK ASSESSMENT
           --------------------------------------------- */

        try {
          const riskData = await apiRequest(
            `/api/risk-assessments/property/${propertyId}`
          );

          setRiskAssessment(riskData);
        } catch (riskError) {
          console.log(
            "Risk assessment could not be loaded:",
            riskError.message
          );

          setRiskAssessment(null);
        }
      } catch (err) {
        console.error("Property loading error:", err);

        setError(err.message || "Unable to load property data.");
      } finally {
        setLoading(false);
      }
    };

    loadPropertyData();
  }, [selectedProperty?.id, location.search]);

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2
            size={42}
            className="animate-spin text-blue-600 mx-auto"
          />

          <p className="mt-4 text-gray-600 font-medium">
            Loading property information...
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
     ========================================================= */

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-md w-full text-center">
          <AlertTriangle
            size={48}
            className="text-orange-500 mx-auto"
          />

          <h2 className="text-xl font-bold text-gray-900 mt-4">
            Unable to Load Property
          </h2>

          <p className="text-gray-500 mt-2">
            {error || "Property information was not found."}
          </p>

          <button
            onClick={() => navigate("/properties")}
            className="mt-6 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
          >
            Back to Property Search
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================
     BACKEND PROPERTY DATA
     ========================================================= */

  const propertyId = property.id;

  const address = property.address || "Address not available";

  const propertyType =
    property.propertyType || "Not available";

  const area =
    property.area !== null && property.area !== undefined
      ? `${Number(property.area).toLocaleString()} sq ft`
      : "Not available";

  const price =
    property.price !== null && property.price !== undefined
      ? `₹${Number(property.price).toLocaleString("en-IN")}`
      : "Not available";

  const status = property.status || "Not available";

  const bedrooms =
    property.bedrooms !== null &&
    property.bedrooms !== undefined
      ? property.bedrooms
      : "Not available";

  const bathrooms =
    property.bathrooms !== null &&
    property.bathrooms !== undefined
      ? property.bathrooms
      : "Not available";

  const description =
    property.description || "No description available.";

  /* =========================================================
     OWNERSHIP DATA
     ========================================================= */

  const ownerName =
    ownership?.ownerName ||
    ownership?.owner ||
    ownership?.ownerFullName ||
    "Not available";
const ownerType =
  ownership?.ownershipType ||
  "Not available";

const documentNumber =
  ownership?.documentReference ||
  "Not available";

  const ownershipVerified =
    ownership?.verified === true ||
    ownership?.isVerified === true;

  /* =========================================================
     RISK DATA
     ========================================================= */

  const riskScore =
    riskAssessment?.riskScore !== null &&
    riskAssessment?.riskScore !== undefined
      ? Number(riskAssessment.riskScore)
      : null;

  const overallRisk =
    riskAssessment?.overallRisk || "Not assessed";

  /* =========================================================
     RISK COLORS
     ========================================================= */

  const getRiskColor = () => {
    if (riskScore === null) return "text-gray-500";

    if (riskScore > 60) {
      return "text-red-600";
    }

    if (riskScore > 20) {
      return "text-orange-500";
    }

    return "text-green-600";
  };

  const getRiskBg = () => {
    if (riskScore === null) {
      return "bg-gray-50 border-gray-200";
    }

    if (riskScore > 60) {
      return "bg-red-50 border-red-200";
    }

    if (riskScore > 20) {
      return "bg-orange-50 border-orange-200";
    }

    return "bg-green-50 border-green-200";
  };

  /* =========================================================
     TABS
     ========================================================= */

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: Home,
    },
    {
      id: "ownership",
      label: "Ownership",
      icon: User,
    },
    {
      id: "history",
      label: "Property History",
      icon: Calendar,
    },
    {
      id: "documents",
      label: "Documents",
      icon: FileText,
    },
  ];

  /* =========================================================
     NAVIGATION
     ========================================================= */

  const startDueDiligence = () => {
    navigate("/due-diligence", {
      state: {
        property,
      },
    });
  };

  const startRiskAssessment = () => {
    navigate("/risk-assessment", {
      state: {
        property,
      },
    });
  };

  /* =========================================================
     FORMAT DATE
     ========================================================= */

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Date not available";
    }

    try {
      return new Date(dateValue).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateValue;
    }
  };

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <div
      className="relative w-full min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        backgroundImage: "url('/p2.png')",
      }}
    >
      <div className="relative z-10 w-full min-h-screen p-2 md:p-4">

        {/* =====================================================
            HEADER
            ===================================================== */}

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-5 md:p-6 mb-5">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

            <div className="flex items-start gap-4">

              <button
                onClick={() => navigate("/properties")}
                className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
              >
                <ArrowLeft size={21} />
              </button>

              <div>

                <div className="flex items-center gap-2 mb-1">
                  <Home
                    size={20}
                    className="text-blue-600"
                  />

                  <span className="text-sm font-medium text-blue-600">
                    Property Details
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {address}
                </h1>

                <div className="flex items-center gap-2 text-gray-500 mt-2">
                  <MapPin size={16} />

                  <span>
                    Property ID: {propertyId}
                  </span>
                </div>

              </div>

            </div>

            <div className="flex flex-wrap gap-3">

              <button
                onClick={startDueDiligence}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition"
              >
                <ShieldCheck size={18} />
                Due Diligence
              </button>

              <button
                onClick={startRiskAssessment}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl font-medium transition"
              >
                <AlertTriangle size={18} />
                Risk Assessment
              </button>

            </div>

          </div>

        </div>

        {/* =====================================================
            PROPERTY SUMMARY
            ===================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">

          {/* Property Type */}

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Property Type
                </p>

                <p className="text-xl font-bold text-gray-900 mt-1">
                  {propertyType}
                </p>

              </div>

              <div className="p-3 bg-blue-50 rounded-xl">
                <Building2
                  className="text-blue-600"
                  size={22}
                />
              </div>

            </div>

          </div>

          {/* Area */}

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Property Area
                </p>

                <p className="text-xl font-bold text-gray-900 mt-1">
                  {area}
                </p>

              </div>

              <div className="p-3 bg-purple-50 rounded-xl">
                <Ruler
                  className="text-purple-600"
                  size={22}
                />
              </div>

            </div>

          </div>

          {/* Ownership */}

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Ownership
                </p>

                <p className="text-xl font-bold text-gray-900 mt-1">
                  {ownership
                    ? ownershipVerified
                      ? "Verified"
                      : "Not Verified"
                    : "Not Available"}
                </p>

              </div>

              <div className="p-3 bg-green-50 rounded-xl">

                {ownershipVerified ? (
                  <CheckCircle
                    className="text-green-600"
                    size={22}
                  />
                ) : (
                  <AlertTriangle
                    className="text-orange-500"
                    size={22}
                  />
                )}

              </div>

            </div>

          </div>

          {/* Risk */}

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Risk Score
                </p>

                <p
                  className={`text-xl font-bold mt-1 ${getRiskColor()}`}
                >
                  {riskScore !== null
                    ? `${riskScore}/100`
                    : "Not assessed"}
                </p>

              </div>

              <div
                className={`p-3 rounded-xl ${getRiskBg()}`}
              >
                <ShieldCheck
                  className={getRiskColor()}
                  size={22}
                />
              </div>

            </div>

          </div>

        </div>

        {/* =====================================================
            TABS
            ===================================================== */}

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-5 overflow-hidden">

          <div className="flex overflow-x-auto border-b border-gray-200">

            {tabs.map((tab) => {

              const Icon = tab.icon;

              const active = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-4 whitespace-nowrap font-medium transition ${
                    active
                      ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );

            })}

          </div>

          {/* =================================================
              OVERVIEW
              ================================================= */}

          {activeTab === "overview" && (

            <div className="p-5 md:p-6">

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                <div className="lg:col-span-2">

                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Property Overview
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <InfoCard
                      icon={MapPin}
                      label="Address"
                      value={address}
                    />

                    <InfoCard
                      icon={Building2}
                      label="Property Type"
                      value={propertyType}
                    />

                    <InfoCard
                      icon={Ruler}
                      label="Area"
                      value={area}
                    />

                    <InfoCard
                      icon={Receipt}
                      label="Price"
                      value={price}
                    />

                    <InfoCard
                      icon={Home}
                      label="Bedrooms"
                      value={bedrooms}
                    />

                    <InfoCard
                      icon={Home}
                      label="Bathrooms"
                      value={bathrooms}
                    />

                    <InfoCard
                      icon={ShieldCheck}
                      label="Status"
                      value={status}
                    />

                    <InfoCard
                      icon={FileText}
                      label="Property ID"
                      value={propertyId}
                    />

                  </div>

                  {/* Description */}

                  <div className="mt-5 border border-gray-200 rounded-xl p-4 bg-white">

                    <p className="text-sm text-gray-500">
                      Description
                    </p>

                    <p className="font-medium text-gray-900 mt-2">
                      {description}
                    </p>

                  </div>

                </div>

                {/* Verification */}

                <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5">

                  <h2 className="font-bold text-gray-900 mb-4">
                    Verification Status
                  </h2>

                  <div className="space-y-4">

                    <StatusRow
                      label="Ownership"
                      status={
                        ownership
                          ? ownershipVerified
                            ? "Verified"
                            : "Review Required"
                          : "Not Available"
                      }
                      success={ownershipVerified}
                    />

                    <StatusRow
                      label="Property"
                      status="Available"
                      success={status === "AVAILABLE"}
                    />

                    <StatusRow
                      label="Risk Assessment"
                      status={
                        riskAssessment
                          ? overallRisk
                          : "Not Assessed"
                      }
                      success={
                        riskAssessment &&
                        overallRisk === "LOW"
                      }
                    />

                  </div>

                </div>

              </div>

              {/* =================================================
                  LOCATION
                  ================================================= */}

              <div className="mt-6">

                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Property Information
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                  <div className="h-72 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center">

                    <div className="text-center">

                      <MapPin
                        size={42}
                        className="mx-auto text-blue-600 mb-3"
                      />

                      <p className="font-semibold text-gray-800">
                        Property Location
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        {address}
                      </p>

                    </div>

                  </div>

                  <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5">

                    <h3 className="font-bold text-gray-900 mb-4">
                      Property Information
                    </h3>

                    <div className="space-y-4">

                      <DetailRow
                        label="Property ID"
                        value={propertyId}
                      />

                      <DetailRow
                        label="Address"
                        value={address}
                      />

                      <DetailRow
                        label="Property Type"
                        value={propertyType}
                      />

                      <DetailRow
                        label="Area"
                        value={area}
                      />

                      <DetailRow
                        label="Price"
                        value={price}
                      />

                      <DetailRow
                        label="Status"
                        value={status}
                      />

                    </div>

                  </div>

                </div>

              </div>

              {/* =================================================
                  QUICK ACTIONS
                  ================================================= */}

              <div className="mt-6">

                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Quick Actions
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                  <QuickAction
                    icon={ShieldCheck}
                    title="Due Diligence"
                    description="Analyze ownership and records"
                    onClick={startDueDiligence}
                  />

                  <QuickAction
                    icon={AlertTriangle}
                    title="Risk Assessment"
                    description="Check property risk"
                    onClick={startRiskAssessment}
                  />

                  <QuickAction
                    icon={FileText}
                    title="View Reports"
                    description="Open generated reports"
                    onClick={() => navigate("/reports")}
                  />

                  <QuickAction
                    icon={Search}
                    title="Search Another"
                    description="Find another property"
                    onClick={() => navigate("/properties")}
                  />

                </div>

              </div>

            </div>

          )}

          {/* =================================================
              OWNERSHIP
              ================================================= */}

          {activeTab === "ownership" && (

            <div className="p-5 md:p-6">

              {!ownership ? (

                <div className="text-center py-12">

                  <User
                    size={48}
                    className="mx-auto text-gray-400"
                  />

                  <h2 className="text-xl font-bold text-gray-700 mt-4">
                    Ownership information not available
                  </h2>

                  <p className="text-gray-500 mt-2">
                    No ownership record was found for this property.
                  </p>

                </div>

              ) : (

                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                    <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5">

                      <div className="flex items-center gap-3 mb-5">

                        <div className="p-3 bg-blue-100 rounded-xl">
                          <User
                            className="text-blue-600"
                            size={22}
                          />
                        </div>

                        <div>

                          <h2 className="font-bold text-gray-900">
                            Current Owner
                          </h2>

                          <p className="text-sm text-gray-500">
                            Official ownership record
                          </p>

                        </div>

                      </div>

                      <div className="bg-white rounded-xl border border-gray-200 p-4">

                        <p className="text-sm text-gray-500">
                          Owner Name
                        </p>

                        <p className="text-lg font-bold text-gray-900 mt-1">
                          {ownerName}
                        </p>

                      </div>

                    </div>

                    <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5">

                      <h2 className="font-bold text-gray-900 mb-5">
                        Ownership Record Information
                      </h2>

                      <div className="space-y-4">

                        <DetailRow
                          label="Owner Type"
                          value={ownerType}
                        />

                        <DetailRow
                          label="Document Number"
                          value={documentNumber}
                        />

                        <DetailRow
                          label="Verification"
                          value={
                            ownershipVerified
                              ? "Verified"
                              : "Not Verified"
                          }
                        />

                        <DetailRow
                          label="Property ID"
                          value={propertyId}
                        />

                      </div>

                    </div>

                  </div>

                  <div
                    className={`mt-5 p-5 rounded-2xl ${
                      ownershipVerified
                        ? "bg-green-50 border border-green-200"
                        : "bg-orange-50 border border-orange-200"
                    }`}
                  >

                    <div className="flex items-start gap-3">

                      {ownershipVerified ? (
                        <CheckCircle
                          className="text-green-600 mt-0.5"
                          size={22}
                        />
                      ) : (
                        <AlertTriangle
                          className="text-orange-500 mt-0.5"
                          size={22}
                        />
                      )}

                      <div>

                        <h3
                          className={`font-bold ${
                            ownershipVerified
                              ? "text-green-800"
                              : "text-orange-800"
                          }`}
                        >
                          {ownershipVerified
                            ? "Ownership Record Verified"
                            : "Ownership Verification Required"}
                        </h3>

                        <p
                          className={`text-sm mt-1 ${
                            ownershipVerified
                              ? "text-green-700"
                              : "text-orange-700"
                          }`}
                        >
                          {ownershipVerified
                            ? "Ownership information is marked as verified in the REDDA property record."
                            : "Ownership information requires additional verification."}
                        </p>

                      </div>

                    </div>

                  </div>
                </>

              )}

            </div>

          )}

          {/* =================================================
              PROPERTY HISTORY
              ================================================= */}

          {activeTab === "history" && (

            <div className="p-5 md:p-6">

              <h2 className="text-xl font-bold text-gray-900 mb-5">
                Property History
              </h2>

              {propertyHistory.length === 0 ? (

                <div className="text-center py-12">

                  <Calendar
                    size={48}
                    className="mx-auto text-gray-400"
                  />

                  <h3 className="text-lg font-semibold text-gray-700 mt-4">
                    No property history found
                  </h3>

                  <p className="text-gray-500 mt-1">
                    No history records are available for this property.
                  </p>

                </div>

              ) : (

                <div className="relative">

                  <div className="absolute left-5 top-2 bottom-2 w-px bg-gray-200" />

                  <div className="space-y-6">

                    {propertyHistory.map((history) => (

                      <TimelineItem
                        key={history.id}
                        date={formatDate(history.eventDate)}
                        title={
                          history.eventType ||
                          "Property Event"
                        }
                        description={
                          history.description ||
                          "Property history updated."
                        }
                        icon={
                          history.eventType ===
                          "OWNERSHIP_UPDATED"
                            ? CheckCircle
                            : history.eventType ===
                              "TAX_UPDATED"
                            ? Receipt
                            : FileText
                        }
                      />

                    ))}

                  </div>

                </div>

              )}

            </div>

          )}

          {/* =================================================
              DOCUMENTS
              ================================================= */}

          {activeTab === "documents" && (

            <div className="p-5 md:p-6">

              <div className="mb-5">

                <h2 className="text-xl font-bold text-gray-900">
                  Property Documents
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Documents associated with this property
                </p>

              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">

                <div className="flex items-start gap-3">

                  <FileText
                    className="text-blue-600 mt-0.5"
                    size={22}
                  />

                  <div>

                    <h3 className="font-semibold text-blue-900">
                      Document API not connected yet
                    </h3>

                    <p className="text-sm text-blue-700 mt-1">
                      Your current backend does not have a
                      Property Documents API. Once that backend
                      module is available, this section can be
                      connected to real documents.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          )}

        </div>

        {/* =====================================================
            RISK / LEGAL SUMMARY
            ===================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Risk */}

          <div
            className={`rounded-2xl border p-5 shadow-lg ${getRiskBg()}`}
          >

            <div className="flex items-start gap-4">

              <div className="p-3 bg-white rounded-xl">

                <ShieldCheck
                  className={getRiskColor()}
                  size={24}
                />

              </div>

              <div>

                <p className="text-sm text-gray-600">
                  Overall Property Risk
                </p>

                <h2
                  className={`text-3xl font-bold ${getRiskColor()}`}
                >
                  {riskScore !== null
                    ? overallRisk
                    : "Not Assessed"}
                </h2>

                <p className="text-sm text-gray-600 mt-2">
                  {riskScore !== null
                    ? `Current REDDA risk score: ${riskScore}/100`
                    : "Risk assessment has not been generated for this property."}
                </p>

              </div>

            </div>

          </div>

          {/* Legal */}

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5">

            <div className="flex items-start gap-4">

              <div className="p-3 bg-orange-50 rounded-xl">

                <Gavel
                  className="text-orange-600"
                  size={24}
                />

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Risk Assessment
                </p>

                <h2 className="text-xl font-bold text-gray-900 mt-1">

                  {riskAssessment
                    ? overallRisk
                    : "Not Available"}

                </h2>

                <p className="text-sm text-gray-500 mt-2">

                  {riskAssessment
                    ? "Risk assessment data received from the backend."
                    : "No risk assessment record is available for this property."}

                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   INFO CARD
   ========================================================= */

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white">

      <div className="flex items-start gap-3">

        <div className="p-2 bg-gray-100 rounded-lg">

          <Icon
            size={18}
            className="text-gray-700"
          />

        </div>

        <div className="min-w-0">

          <p className="text-xs text-gray-500">
            {label}
          </p>

          <p className="font-semibold text-gray-900 mt-1 break-words">
            {value}
          </p>

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   DETAIL ROW
   ========================================================= */

function DetailRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">

      <span className="text-sm text-gray-500">
        {label}
      </span>

      <span className="text-sm font-semibold text-gray-900 sm:text-right">
        {value}
      </span>

    </div>
  );
}

/* =========================================================
   STATUS ROW
   ========================================================= */

function StatusRow({ label, status, success }) {
  return (
    <div className="flex items-center justify-between gap-3">

      <span className="text-sm text-gray-700">
        {label}
      </span>

      <div className="flex items-center gap-1.5">

        {success ? (
          <CheckCircle
            size={16}
            className="text-green-600"
          />
        ) : (
          <AlertTriangle
            size={16}
            className="text-orange-500"
          />
        )}

        <span
          className={`text-xs font-semibold ${
            success
              ? "text-green-700"
              : "text-orange-600"
          }`}
        >
          {status}
        </span>

      </div>

    </div>
  );
}

/* =========================================================
   QUICK ACTION
   ========================================================= */

function QuickAction({
  icon: Icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="text-left p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition group"
    >

      <div className="flex items-start gap-3">

        <div className="p-2.5 bg-gray-100 group-hover:bg-white rounded-xl transition">

          <Icon
            size={20}
            className="text-blue-600"
          />

        </div>

        <div>

          <p className="font-semibold text-gray-900">
            {title}
          </p>

          <p className="text-xs text-gray-500 mt-1">
            {description}
          </p>

        </div>

      </div>

    </button>
  );
}

/* =========================================================
   TIMELINE ITEM
   ========================================================= */

function TimelineItem({
  date,
  title,
  description,
  icon: Icon,
}) {
  return (
    <div className="relative flex gap-4">

      <div className="relative z-10 w-10 h-10 shrink-0 rounded-full bg-white border-2 border-blue-200 flex items-center justify-center">

        <Icon
          size={18}
          className="text-blue-600"
        />

      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex-1">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">

          <h3 className="font-semibold text-gray-900">
            {title}
          </h3>

          <span className="text-xs text-gray-500">
            {date}
          </span>

        </div>

        <p className="text-sm text-gray-500 mt-1">
          {description}
        </p>

      </div>

    </div>
  );
}

export default PropertyDetails;