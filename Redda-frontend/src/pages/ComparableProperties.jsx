
import { useState } from "react";

const API = "http://localhost:8080";

export default function ComparableProperties() {
  const [propertyId, setPropertyId] = useState("3");
  const [comparables, setComparables] = useState([]);
  const [averagePrice, setAveragePrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadComparables = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setComparables([]);
    setAveragePrice(null);

    try {
      const token = localStorage.getItem("reddaToken");

      const headers = {
        ...(token
          ? { Authorization: `Bearer ${token}` }
          : {}),
      };

      const id = propertyId.trim();

      if (!id || !/^\d+$/.test(id)) {
        throw new Error("Enter a valid property ID.");
      }

      const [comparisonResponse, trendsResponse] =
        await Promise.all([
          fetch(
            `${API}/api/comparable-properties/target/${id}`,
            { headers }
          ),
          fetch(
            `${API}/api/comparable-properties/market-trends/${id}`,
            { headers }
          ),
        ]);

      if (!comparisonResponse.ok) {
        throw new Error(
          `Could not load comparisons (HTTP ${comparisonResponse.status}).`
        );
      }

      const data = await comparisonResponse.json();

      setComparables(Array.isArray(data) ? data : []);

      if (trendsResponse.ok) {
        const price = await trendsResponse.json();
        setAveragePrice(
          typeof price === "number" ? price : null
        );
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const money = (value) =>
    typeof value === "number"
      ? new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }).format(value)
      : "Not available";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Comparable Properties
      </h1>

      <p className="mt-2 text-gray-600">
        Compare property prices and review market trends
        using data from the backend.
      </p>

      <form
        onSubmit={loadComparables}
        className="mt-6 flex flex-wrap gap-3 rounded-xl border bg-white p-5"
      >
        <label className="flex flex-col gap-2 text-sm font-medium">
          Target Property ID
          <input
            type="number"
            min="1"
            required
            value={propertyId}
            onChange={(event) =>
              setPropertyId(event.target.value)
            }
            className="rounded-lg border px-4 py-2"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="self-end rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Loading..." : "Compare Properties"}
        </button>
      </form>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 p-4 text-red-700">
          {error}
        </p>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">
            Comparable Listings
          </p>
          <p className="mt-2 text-3xl font-bold">
            {comparables.length}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">
            Average Comparable Price
          </p>
          <p className="mt-2 text-2xl font-bold">
            {averagePrice === null
              ? "Not available"
              : money(averagePrice)}
          </p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border bg-white">
        <h2 className="border-b p-5 text-xl font-semibold">
          Price Comparison
        </h2>

        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">Comparable ID</th>
              <th className="p-4">Property ID</th>
              <th className="p-4">Distance</th>
              <th className="p-4">Price Difference</th>
              <th className="p-4">Price per Sq. Ft.</th>
            </tr>
          </thead>

          <tbody>
            {comparables.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-4">{item.id}</td>
                <td className="p-4">
                  {item.comparableProperty?.id ??
                    "Not available"}
                </td>
                <td className="p-4">
                  {item.distance ?? "Not available"}
                </td>
                <td className="p-4">
                  {money(item.priceDifference)}
                </td>
                <td className="p-4">
                  {money(item.pricePerSqft)}
                </td>
              </tr>
            ))}

            {!loading && comparables.length === 0 && !error && (
              <tr>
                <td
                  colSpan={5}
                  className="p-6 text-center text-gray-500"
                >
                  No comparable records found. Load data or
                  select another property ID.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
