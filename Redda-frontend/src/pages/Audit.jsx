import { useEffect, useState } from "react";
import {
  Activity,
  FileText,
  Server,
  User,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

function Audit() {
  const [activityLogs, setActivityLogs] = useState([]);
  const [apiLogs, setApiLogs] = useState([]);
  const [reportHistory, setReportHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAuditData = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("reddaToken");

        const headers = {
          "Content-Type": "application/json",
          ...(token
            ? { Authorization: `Bearer ${token}` }
            : {}),
        };

        const [
          activityResponse,
          apiResponse,
          reportResponse,
        ] = await Promise.all([
          fetch("http://localhost:8080/api/activity-logs", {
            headers,
          }),
          fetch("http://localhost:8080/api/api-logs", {
            headers,
          }),
          fetch("http://localhost:8080/api/report-history", {
            headers,
          }),
        ]);

        if (!activityResponse.ok) {
          throw new Error("Failed to load activity logs.");
        }

        if (!apiResponse.ok) {
          throw new Error("Failed to load API logs.");
        }

        if (!reportResponse.ok) {
          throw new Error("Failed to load report history.");
        }

        const activityData = await activityResponse.json();
        const apiData = await apiResponse.json();
        const reportData = await reportResponse.json();

        setActivityLogs(
          Array.isArray(activityData) ? activityData : []
        );

        setApiLogs(
          Array.isArray(apiData) ? apiData : []
        );

        setReportHistory(
          Array.isArray(reportData) ? reportData : []
        );
      } catch (err) {
        console.error("Audit loading failed:", err);
        setError(err.message || "Failed to load audit data.");
      } finally {
        setLoading(false);
      }
    };

    loadAuditData();
  }, []);

  const formatDate = (value) => {
    if (!value) {
      return "N/A";
    }

    return new Date(value).toLocaleString("en-IN");
  };

  const getStatusStyle = (statusCode) => {
    if (statusCode >= 200 && statusCode < 300) {
      return "text-green-700 bg-green-100";
    }

    if (statusCode >= 400) {
      return "text-red-700 bg-red-100";
    }

    return "text-orange-700 bg-orange-100";
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center bg-fixed">
      <div className="relative z-10 p-4 md:p-6 space-y-6">

        {/* Header */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-white/70 shadow-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Activity
                    size={23}
                    className="text-purple-600"
                  />
                </div>

                <div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    Audit
                  </h1>

                  <p className="text-sm text-slate-500 mt-1">
                    Track system activity, API usage and report history.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl">
              <CheckCircle2 size={18} />
              <span className="text-sm font-semibold">
                Audit System Active
              </span>
            </div>

          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
                <User
                  size={22}
                  className="text-blue-600"
                />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Activity Logs
                </p>

                <h2 className="text-2xl font-bold text-slate-900">
                  {activityLogs.length}
                </h2>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center">
                <Server
                  size={22}
                  className="text-orange-600"
                />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  API Logs
                </p>

                <h2 className="text-2xl font-bold text-slate-900">
                  {apiLogs.length}
                </h2>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">
                <FileText
                  size={22}
                  className="text-green-600"
                />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Report History
                </p>

                <h2 className="text-2xl font-bold text-slate-900">
                  {reportHistory.length}
                </h2>
              </div>
            </div>
          </div>

        </div>

        {/* Activity Logs */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6">

          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Activity
                size={20}
                className="text-blue-600"
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Activity Logs
              </h2>

              <p className="text-sm text-slate-500">
                User actions recorded by the system.
              </p>
            </div>
          </div>

          {loading ? (
            <p className="text-slate-500">
              Loading activity logs...
            </p>
          ) : activityLogs.length === 0 ? (
            <p className="text-slate-500">
              No activity logs available.
            </p>
          ) : (
            <div className="space-y-3">
              {activityLogs.map((log) => (
                <div
                  key={log.id}
                  className="border border-slate-200 rounded-xl p-4"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">

                    <div>
                      <p className="font-semibold text-slate-800">
                        {log.action}
                      </p>

                      <p className="text-sm text-slate-500 mt-1">
                        {log.description}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-slate-400">
                        User ID: {log.userId}
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        {formatDate(log.timestamp)}
                      </p>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* API Logs */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6">

          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <Server
                size={20}
                className="text-orange-600"
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                API Logs
              </h2>

              <p className="text-sm text-slate-500">
                API requests and response status codes.
              </p>
            </div>
          </div>

          {loading ? (
            <p className="text-slate-500">
              Loading API logs...
            </p>
          ) : apiLogs.length === 0 ? (
            <p className="text-slate-500">
              No API logs available.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">

                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-3 text-sm text-slate-500">
                      Method
                    </th>

                    <th className="py-3 px-3 text-sm text-slate-500">
                      Endpoint
                    </th>

                    <th className="py-3 px-3 text-sm text-slate-500">
                      Status
                    </th>

                    <th className="py-3 px-3 text-sm text-slate-500">
                      User
                    </th>

                    <th className="py-3 px-3 text-sm text-slate-500">
                      Time
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {apiLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-b border-slate-100"
                    >
                      <td className="py-3 px-3 font-semibold text-slate-800">
                        {log.method}
                      </td>

                      <td className="py-3 px-3 text-sm text-slate-600">
                        {log.endpoint}
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                            log.statusCode
                          )}`}
                        >
                          {log.statusCode}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-sm text-slate-600">
                        {log.userId}
                      </td>

                      <td className="py-3 px-3 text-xs text-slate-400">
                        {formatDate(log.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}

        </div>

        {/* Report History */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6">

          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <FileText
                size={20}
                className="text-green-600"
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Report History
              </h2>

              <p className="text-sm text-slate-500">
                Previously generated due diligence reports.
              </p>
            </div>
          </div>

          {loading ? (
            <p className="text-slate-500">
              Loading report history...
            </p>
          ) : reportHistory.length === 0 ? (
            <p className="text-slate-500">
              No report history available.
            </p>
          ) : (
            <div className="space-y-3">
              {reportHistory.map((report) => (
                <div
                  key={report.id}
                  className="border border-slate-200 rounded-xl p-4"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                    <div>
                      <p className="font-semibold text-slate-800">
                        {report.reportType}
                      </p>

                      <p className="text-sm text-slate-500 mt-1">
                        Property ID: {report.propertyId}
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        User ID: {report.userId}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">

                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                        {report.fileFormat}
                      </span>

                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                        {report.status}
                      </span>

                      <span className="text-xs text-slate-400">
                        {formatDate(report.generatedAt)}
                      </span>

                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* User Activity */}
        <div className="bg-slate-900 rounded-2xl shadow-lg p-6 text-white">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <User size={20} />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                User Activity
              </h2>

              <p className="text-sm text-slate-400">
                User activity is tracked through the Activity Logs.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Audit;