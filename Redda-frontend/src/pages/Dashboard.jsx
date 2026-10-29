import { useEffect, useState } from "react";

import {
  Building2,
  FileText,
  AlertTriangle,
  Bell,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  Home,
  Sparkles,
  Database,
  ArrowUpRight,
} from "lucide-react";

function Dashboard() {
  const [properties, setProperties] = useState([]);
  const [reports, setReports] = useState([]);
  const [riskAssessments, setRiskAssessments] = useState([]);
  const [notifications, setNotifications] = useState([]);

useEffect(() => {
  const loadProperties = async () => {
    try {
      const token = localStorage.getItem("reddaToken");

      const headers = token
        ? { Authorization: `Bearer ${token}` }
        : {};

      // Load properties
      const response = await fetch(
        "http://localhost:8080/api/properties",
        { headers }
      );

      if (!response.ok) {
        throw new Error("Failed to load properties");
      }

      const data = await response.json();
      setProperties(Array.isArray(data) ? data : []);

      // Load reports
      const reportResponse = await fetch(
        "http://localhost:8080/api/report-history",
        { headers }
      );

      if (!reportResponse.ok) {
        throw new Error("Failed to load reports");
      }

      const reportData = await reportResponse.json();
      setReports(Array.isArray(reportData) ? reportData : []);
      // Load risk assessments
const riskResponse = await fetch(
  "http://localhost:8080/api/risk-assessments",
  { headers }
);

if (!riskResponse.ok) {
  throw new Error("Failed to load risk assessments");
}

const riskData = await riskResponse.json();
setRiskAssessments(Array.isArray(riskData) ? riskData : []);

const notificationResponse = await fetch(
  "http://localhost:8080/api/notifications",
  { headers }
);

if (!notificationResponse.ok) {
  throw new Error("Failed to load notifications");
}

const notificationData = await notificationResponse.json();
setNotifications(
  Array.isArray(notificationData) ? notificationData : []
);


    } catch (error) {
      console.error("Could not load dashboard data:", error);
    }
  };

  loadProperties();
}, []);


const activities = notifications
  .slice()
  .reverse()
  .slice(0, 4)
  .map((notification) => {
    const type = notification.type || "";

    let icon = Bell;
    let color = "text-orange-600";
    let bg = "bg-orange-100";

    if (type === "DUE_DILIGENCE_COMPLETED") {
      icon = CheckCircle2;
      color = "text-green-600";
      bg = "bg-green-100";
    } else if (type === "REPORT_READY") {
      icon = FileText;
      color = "text-blue-600";
      bg = "bg-blue-100";
    } else if (type === "PROPERTY_UPDATE") {
      icon = Database;
      color = "text-orange-600";
      bg = "bg-orange-100";
    } else if (type === "RISK_ALERT") {
      icon = ShieldAlert;
      color = "text-red-600";
      bg = "bg-red-100";
    }

    return {
      title: notification.message,
      address: notification.propertyId
        ? `Property ID: ${notification.propertyId}`
        : "General notification",
      time: notification.createdAt
        ? new Date(notification.createdAt).toLocaleString()
        : "Time unavailable",
      image: "/image.png",
      icon,
      color,
      bg,
    };
  });

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/p2.png')" }}
    >
    

      <div className="relative z-10 space-y-6 p-2">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Dashboard
          </h1>

          <p className="mt-1 text-slate-600">
            Welcome back! Here's your property overview.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

          {/* Total Properties */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-white/70 p-5 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-start justify-between">

              <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">
                <Building2
                  className="text-green-600"
                  size={23}
                />
              </div>

              <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                <ArrowUpRight size={16} />
                +12%
              </div>

            </div>

            <p className="mt-4 text-sm text-slate-500">
              Total Properties
            </p>

            <div className="flex items-end gap-3 mt-1">
              <h2 className="text-3xl font-bold text-slate-900">
                {properties.length}
              </h2>

              <span className="text-xs text-slate-400 mb-1">
                this month
              </span>
            </div>

            <p className="mt-3 text-sm font-medium text-green-600 cursor-pointer hover:underline">
              View all properties →
            </p>
          </div>

          {/* Reports */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-white/70 p-5 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-start justify-between">

              <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
                <FileText
                  className="text-blue-600"
                  size={23}
                />
              </div>

              <div className="flex items-center gap-1 text-blue-600 text-sm font-semibold">
                <ArrowUpRight size={16} />
                +29%
              </div>

            </div>

            <p className="mt-4 text-sm text-slate-500">
              Reports Generated
            </p>

            <div className="flex items-end gap-3 mt-1">
              <h2 className="text-3xl font-bold text-slate-900">
                {reports.length}
              </h2>

              <span className="text-xs text-slate-400 mb-1">
                this month
              </span>
            </div>

            <p className="mt-3 text-sm font-medium text-green-600 cursor-pointer hover:underline">
              View all reports →
            </p>
          </div>

          {/* High Risk */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-white/70 p-5 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-start justify-between">

              <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center">
                <AlertTriangle
                  className="text-red-600"
                  size={23}
                />
              </div>

              <span className="text-sm font-semibold text-red-500">
                25%
              </span>

            </div>

            <p className="mt-4 text-sm text-slate-500">
              High Risk Properties
            </p>

            <div className="flex items-end gap-3 mt-1">
             <h2 className="text-3xl font-bold text-red-600">
              {riskAssessments.filter(
                (assessment) =>
                assessment.overallRisk?.toUpperCase() === "HIGH"
               ).length}
                </h2>

              <span className="text-xs text-red-400 mb-1">
                require attention
              </span>
            </div>

            <p className="mt-3 text-sm font-medium text-red-500">
              Requires attention
            </p>
          </div>

          {/* Alerts */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-white/70 p-5 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-start justify-between">

              <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center">
                <Bell
                  className="text-orange-500"
                  size={23}
                />
              </div>

              <span className="text-sm font-semibold text-orange-500">
                {notifications.filter(
                   (notification) => !notification.read
                     ).length} unread
              </span>

            </div>

            <p className="mt-4 text-sm text-slate-500">
              Alerts
            </p>

            <div className="flex items-end gap-3 mt-1">
              <h2 className="text-3xl font-bold text-orange-500">
              {notifications.filter(
                  (notification) => notification.read === false
                    ).length}
              </h2>

              <span className="text-xs text-orange-400 mb-1">
                requires action
              </span>
            </div>

            <p className="mt-3 text-sm font-medium text-orange-500">
              View alerts →
            </p>
          </div>

        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Recent Activity */}
          <div className="xl:col-span-2 bg-white/90 backdrop-blur-md rounded-2xl border border-white/70 shadow-lg p-6">

            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-slate-900">
                Recent Activity
              </h2>

              <button className="text-sm font-semibold text-green-600 hover:underline">
                View all
              </button>
            </div>

            <div className="space-y-1">

              {activities.map((activity, index) => {
                const Icon = activity.icon;

                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 py-3 border-b last:border-b-0 border-slate-100"
                  >

                    <img
                      src={activity.image}
                      alt="Property"
                      className="w-16 h-14 rounded-xl object-cover shadow-sm"
                    />

                    <div
                      className={`w-9 h-9 rounded-full ${activity.bg} flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon
                        size={18}
                        className={activity.color}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800">
                        {activity.title}
                      </p>

                      <p className="text-sm text-slate-500 mt-1">
                        {activity.address}
                      </p>
                    </div>

                    <span className="text-sm text-slate-400 whitespace-nowrap">
                      {activity.time}
                    </span>

                  </div>
                );
              })}

            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">

            {/* Portfolio Health */}
           
{/* Portfolio Health */}
<div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white p-6 min-h-[250px] shadow-lg">

  <div className="absolute inset-0 opacity-20">
    <img
      src="/p2.png"
      alt=""
      className="w-full h-full object-cover"
    />
  </div>

  <div className="relative z-10">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
        <ShieldCheck size={23} className="text-green-400" />
      </div>

      <div>
        <h2 className="text-lg font-bold">Portfolio Health</h2>
        <p className="text-xs text-slate-300">
          Overall safety overview of your properties
        </p>
      </div>
    </div>

    <div className="flex items-center justify-between mt-6">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Home size={17} className="text-green-400" />
          <span>
            <b>{riskAssessments.length}</b> Properties analyzed
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <AlertTriangle size={17} className="text-orange-400" />
          <span>
            <b>
              {riskAssessments.filter(
                (a) =>
  ["HIGH", "MEDIUM"].includes(
    a.overallRisk?.toUpperCase()
  )
              ).length}
            </b>{" "}
            Require attention
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <ShieldCheck size={17} className="text-green-400" />
          <span>
            <b>
              {riskAssessments.filter(
                (a) => a.overallRisk?.toUpperCase() === "LOW"
              ).length}
            </b>{" "}
            Low-risk properties
          </span>
        </div>
      </div>

      <div className="w-28 h-28 rounded-full border-[10px] border-green-400/30 border-t-green-400 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-bold">
            {riskAssessments.length > 0
              ? Math.round(
                  riskAssessments.reduce(
                    (total, a) => total + (100 - (a.riskScore ?? 0)),
                    0
                  ) / riskAssessments.length
                )
              : 0}
          </div>
          <div className="text-xs text-slate-300">/100</div>
        </div>
      </div>
    </div>

    <div className="inline-flex items-center gap-2 mt-5 bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-xs font-semibold">
      <span className="w-2 h-2 rounded-full bg-green-400" />
      {riskAssessments.length === 0
  ? "NOT ASSESSED"
  : riskAssessments.some(
      (a) => a.overallRisk?.toUpperCase() === "HIGH"
    )
  ? "HIGH RISK"
  : riskAssessments.some(
      (a) => a.overallRisk?.toUpperCase() === "MEDIUM"
    )
  ? "MEDIUM RISK"
  : "LOW RISK"}
    </div>
  </div>
</div>


            {/* REDDA AI */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50/95 to-white/95 backdrop-blur-md border border-green-100 p-6 min-h-[190px] shadow-lg">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                    <Sparkles
                      size={22}
                      className="text-green-600"
                    />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      REDDA AI
                    </h2>

                    <p className="text-xs text-slate-500">
                      Purchase Intelligence
                    </p>
                  </div>

                </div>

                <span className="text-xs font-semibold bg-green-100 text-green-600 px-3 py-1.5 rounded-full">
                  AI Analysis
                </span>

              </div>

              <p className="mt-5 text-sm text-slate-600 max-w-md">
               {riskAssessments.filter(
  (a) => ["HIGH", "MEDIUM"].includes(
    a.overallRisk?.toUpperCase()
  )
).length} properties require additional due diligence before purchase.
              </p>

              <button className="mt-4 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition">
                View AI Analysis →
              </button>

            </div>

          </div>

        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* Risk Summary */}
          
{/* Risk Summary */}
<div className="bg-white/90 backdrop-blur-md rounded-2xl border border-white/70 shadow-lg p-6">
  <div className="flex items-center justify-between">
    <h2 className="text-xl font-bold text-slate-900">
      Risk Summary
    </h2>
    <span className="text-sm text-slate-400">
      {riskAssessments.length} Assessments
    </span>
  </div>

  <div className="mt-6 space-y-5">
    {/* High Risk */}
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm text-slate-600">High Risk</span>
        <span className="text-sm font-semibold text-red-600">
          {riskAssessments.filter(
            (a) => a.overallRisk?.toUpperCase() === "HIGH"
          ).length}
        </span>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-red-500 rounded-full"
          style={{
            width: `${
              riskAssessments.length
                ? (riskAssessments.filter(
                    (a) => a.overallRisk?.toUpperCase() === "HIGH"
                  ).length / riskAssessments.length) * 100
                : 0
            }%`,
          }}
        />
      </div>
    </div>

    {/* Medium Risk */}
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm text-slate-600">Medium Risk</span>
        <span className="text-sm font-semibold text-orange-500">
          {riskAssessments.filter(
            (a) => a.overallRisk?.toUpperCase() === "MEDIUM"
          ).length}
        </span>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-orange-400 rounded-full"
          style={{
            width: `${
              riskAssessments.length
                ? (riskAssessments.filter(
                    (a) => a.overallRisk?.toUpperCase() === "MEDIUM"
                  ).length / riskAssessments.length) * 100
                : 0
            }%`,
          }}
        />
      </div>
    </div>

    {/* Low Risk */}
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm text-slate-600">Low Risk</span>
        <span className="text-sm font-semibold text-green-600">
          {riskAssessments.filter(
            (a) => a.overallRisk?.toUpperCase() === "LOW"
          ).length}
        </span>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 rounded-full"
          style={{
            width: `${
              riskAssessments.length
                ? (riskAssessments.filter(
                    (a) => a.overallRisk?.toUpperCase() === "LOW"
                  ).length / riskAssessments.length) * 100
                : 0
            }%`,
          }}
        />
      </div>
    </div>
  </div>
</div>


          {/* Properties Requiring Attention */}
          
{/* Properties Requiring Attention */}
<div className="bg-slate-900 rounded-2xl shadow-lg p-6 text-white">

  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
        <AlertTriangle size={22} className="text-red-400" />
      </div>

      <h2 className="text-xl font-bold">
        Properties Requiring Attention
      </h2>
    </div>

    <span className="text-sm text-green-400">
      {riskAssessments.filter(
        (a) => ["HIGH", "MEDIUM"].includes(
          a.overallRisk?.toUpperCase()
        )
      ).length} properties
    </span>
  </div>

  <div className="mt-5 space-y-4">
    {riskAssessments
      .filter((a) =>
        ["HIGH", "MEDIUM"].includes(
          a.overallRisk?.toUpperCase()
        )
      )
      .map((assessment, index) => {
        const risk = assessment.overallRisk.toUpperCase();
        const isHigh = risk === "HIGH";

        const property = properties.find(
          (p) =>
            p.id === assessment.propertyId ||
            p.id === assessment.property?.id
        );

        const address =
          assessment.property?.address ||
          property?.address ||
          property?.propertyAddress ||
          `Property ID: ${assessment.propertyId ?? assessment.id}`;

        return (
          <div
            key={assessment.id ?? index}
            className="flex items-center justify-between gap-4 border-b border-slate-700 pb-3 last:border-b-0"
          >
            <div className="min-w-0">
              <p className="font-semibold">
                {address}
              </p>

              <p className="text-xs text-slate-400 mt-1">
                {isHigh
                  ? "High-risk assessment requires review"
                  : "Medium-risk assessment requires review"}
              </p>
            </div>

            <span
              className={`text-xs px-3 py-1 rounded-full whitespace-nowrap ${
                isHigh
                  ? "bg-red-500/20 text-red-400"
                  : "bg-orange-500/20 text-orange-400"
              }`}
            >
              {risk} Risk
            </span>
          </div>
        );
      })}

    {riskAssessments.filter(
      (a) => ["HIGH", "MEDIUM"].includes(
        a.overallRisk?.toUpperCase()
      )
    ).length === 0 && (
      <p className="text-sm text-slate-400">
        No properties currently require attention.
      </p>
    )}
  </div>

</div>
</div>

      </div>
    </div>
  );
}

export default Dashboard;