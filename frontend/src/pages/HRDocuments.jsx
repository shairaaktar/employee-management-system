import { useEffect, useState } from "react";
import API from "../api";

export default function HRDocuments() {
  const [docs, setDocs] = useState([]);

  const fetchDocs = async () => {
    const res = await API.get("/documents");
    setDocs(res.data);
  };

  const verifyDoc = async (id) => {
    await API.put(`/documents/${id}/verify`);
    fetchDocs();
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Employee Documents</h1>

      <div className="grid gap-3">
        {docs.map((d) => (
          <div
            key={d._id}
            className="bg-white/60 dark:bg-gray-800/50 p-4 rounded-lg shadow flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{d.user?.name}</p>
              <p className="text-sm text-gray-500">File: {d.fileName}</p>
              <p>Category: {d.category}</p>
            </div>
            <div className="flex gap-2">
              <a
                href={`http://localhost:5000/${d.filePath}`}
                target="_blank"
                rel="noreferrer"
                className="bg-gray-200 text-sm px-3 py-1 rounded"
              >
                View
              </a>
              {!d.verified && (
                <button
                  onClick={() => verifyDoc(d._id)}
                  className="bg-green-500 text-white text-sm px-3 py-1 rounded"
                >
                  Verify
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
