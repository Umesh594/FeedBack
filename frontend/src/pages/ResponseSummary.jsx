import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../utils/api";

const ResponseSummary = () => {
  const { formId } = useParams();
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added state to show error

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await api.getSummary(formId);
        setSummary(data.summary);
      } catch (error) {
        setError("Failed to fetch summary");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [formId]);

  if (loading) return <div className="p-4">Loading summary...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6">Response Summary</h2>

      {error && (
        <p className="text-red-500 font-semibold mb-4">{error}</p>
      )}

      {summary.length === 0 && !error && <p>No summary available.</p>}

      {summary.map((item, index) => (
        <div key={index} className="mb-6">
          <h3 className="text-lg font-semibold">
            {index + 1}. {item.question}
          </h3>
          {item.type === "multiple-choice" && item.summary ? (
            <ul className="mt-2 list-disc list-inside">
              {item.summary.map((opt, idx) => (
                <li key={idx}>
                  {opt.option}: <strong>{opt.count}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground italic mt-1">
              Text answers not summarized
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ResponseSummary;
