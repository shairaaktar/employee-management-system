import { useState, useEffect } from "react";
import API from "../api";

export default function EmployeeDocuments() {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("Resume");
  const [docs, setDocs] = useState([]);

  const fetchDocs = async () => {
    const res = await API.get("/documents/my");
    setDocs(res.data);
  };

  const uploadFile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);
    await API.post("/documents", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setFile(null);
    fetchDocs();
  };

  const deleteDoc = async (id) => {
    await API.delete(`/documents/${id}`);
    fetchDocs();
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Documents</h1>

      <form onSubmit={uploadFile} className="flex flex-col md:flex-row gap-4 mb-6">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded"
        >
          <option>Resume</option>
          <option>ID Proof</option>
          <option>Certificate</option>
          <option>Payslip</option>
          <option>Other</option>
        </select>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Upload
        </button>
      </form>

      <div className="grid gap-3">
        {docs.map((d) => (
          <div
            key={d._id}
            className="bg-white/60 dark:bg-gray-800/50 p-4 rounded-lg shadow flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{d.fileName}</p>
              <p className="text-sm text-gray-500">Category: {d.category}</p>
              <p
                className={`text-xs ${
                  d.verified ? "text-green-500" : "text-yellow-500"
                }`}
              >
                {d.verified ? "Verified" : "Pending Verification"}
              </p>
            </div>
            <a
              href={`http://localhost:5000/${d.filePath}`}
              target="_blank"
              rel="noreferrer"
              className="bg-gray-200 text-sm px-3 py-1 rounded mr-2"
            >
              View
            </a>
            <button
              onClick={() => deleteDoc(d._id)}
              className="bg-red-500 text-white text-sm px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
