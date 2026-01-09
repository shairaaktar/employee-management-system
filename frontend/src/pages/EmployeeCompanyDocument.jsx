import { useEffect, useState } from "react";
import API from "../api";

export default function EmployeeCompanyDocument() {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    API.get("/company-docs/employee").then((res) => setDocs(res.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">📄 Your Documents</h2>

      <ul className="mt-4 space-y-3">
        {docs.map((doc) => (
          <li key={doc._id} className="bg-white p-4 rounded shadow">
            <p className="font-semibold">{doc.title}</p>
            <p className="text-sm text-gray-500">{doc.category}</p>
            <a href={doc.fileUrl} className="text-blue-600 underline text-sm" target="_blank">
              Download
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
