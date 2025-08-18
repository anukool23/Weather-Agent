import { useState } from "react";
import axios from "axios";


export default function App() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResponse("");

    try {
      const res = await axios.post(`${baseURL}/ask`, {
        query,
      });
      setResponse(res.data?.answer || "No response from server");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center">
          Weather Query Bot
        </h1>

        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your query..."
          className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring focus:ring-blue-500"
        />

        {/* Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-opacity disabled:opacity-50"
        >
          {loading ? "Loading..." : "Ask"}
        </button>

        {/* Loader */}
        {loading && (
          <div className="flex justify-center mt-4">
            <div className="size-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-red-500 mt-4 text-center text-sm">{error}</p>
        )}

        {/* Response */}
        {response && (
          <textarea
            value={response}
            readOnly
            className="w-full mt-4 p-3 border rounded-lg bg-gray-50 text-gray-800 resize-none"
            rows={4}
          />
        )}
      </div>
    </div>
  );
}
