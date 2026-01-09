import { useState, useEffect } from "react";
import API from "../api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function AddPayroll() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    employeeId: "",
    baseSalary: "",
    bonus: "",
    deductions: "",
    month: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      const { data } = await API.get("/employees");
      setEmployees(data);
    };
    fetchEmployees();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/payrolls/generate", form);
      toast.success("Payroll record created");
      navigate("/payrolls");
    } catch (err) {
      toast.error("Failed to create payroll");
    }
  };

  return (
    <div className="p-6 md:p-10 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow w-full md:w-1/2"
      >
        <h2 className="text-xl font-semibold mb-4">Add Payroll</h2>
        <div className="grid gap-4">
          <select
            name="employeeId"
            value={form.employeeId}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name} ({emp.department})
              </option>
            ))}
          </select>

          <input
            type="number"
            name="baseSalary"
            placeholder="Base Salary"
            value={form.baseSalary}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            name="bonus"
            placeholder="Bonus"
            value={form.bonus}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="deductions"
            placeholder="Deductions"
            value={form.deductions}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="month"
            name="month"
            value={form.month}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <button className="bg-green-500 text-white py-2 rounded hover:bg-green-600">
            Create Payroll
          </button>
        </div>
      </form>
    </div>
  );
}
