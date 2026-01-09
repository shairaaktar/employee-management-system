import { useState, useEffect } from "react";
import API from "../api";
import toast from "react-hot-toast";

export default function CompanyDocument() {
  const [docs, setDocs] = useState([]);
  const [form, setForm] = useState({
    title: "",
    category: "policy",
    visibility: "all",
    department: "",
    allowedEmployees: [],
  });
  const [file, setFile] = useState(null);
  const [employees, setEmployees] = useState([]);

  const fetchDocs = async () => {
    const { data } = await API.get("/company-docs/all");
    setDocs(data);
  };

  const fetchEmployees = async () => {
    const { data } = await API.get("/employees");
    setEmployees(data);
  };

  useEffect(() => {
    fetchDocs();
    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      fd.append(key, Array.isArray(val) ? JSON.stringify(val) : val);
    });

    if (file) fd.append("file", file);

    try {
      await API.post("/company-docs/upload", fd);
      toast.success("Document uploaded");
      fetchDocs();
    } catch (err) {
      toast.error("Upload failed");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">📁 Upload HR / Company Documents</h2>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
        <input
          className="border p-2 w-full mb-3"
          placeholder="Document Title"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <select
          className="border p-2 w-full mb-3"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="policy">Policy</option>
          <option value="performance-letter">Performance Letter</option>
          <option value="promotion-letter">Promotion Letter</option>
          <option value="lnd-letter">L&D Letter</option>
          <option value="template">Template</option>
        </select>

        <select
          className="border p-2 w-full mb-3"
          value={form.visibility}
          onChange={(e) => setForm({ ...form, visibility: e.target.value })}
        >
          <option value="all">All Employees</option>
          <option value="managers">Managers Only</option>
          <option value="department">Department</option>
          <option value="team">Team</option>
          <option value="individual">Individual</option>
        </select>

        {form.visibility === "individual" && (
          <select
            className="border p-2 w-full mb-3"
            multiple
            onChange={(e) =>
              setForm({
                ...form,
                allowedEmployees: [...e.target.selectedOptions].map(
                  (o) => o.value
                ),
              })
            }
          >
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name}
              </option>
            ))}
          </select>
        )}

        <input
          type="file"
          className="border p-2 mb-3 w-full"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Upload
        </button>
      </form>

      <h3 className="mt-6 text-lg font-semibold">📄 All Documents</h3>
      <ul className="mt-3 space-y-2">
        {docs.map((d) => (
          <li key={d._id} className="border p-3 rounded bg-white shadow">
            <p className="font-medium">{d.title}</p>
            <p className="text-sm text-gray-500">{d.category}</p>
            <a
              href={d.fileUrl}
              target="_blank"
              className="text-blue-600 underline text-sm"
            >
              View
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
