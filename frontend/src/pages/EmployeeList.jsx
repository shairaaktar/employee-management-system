import { useEffect, useState } from "react";
import API from "../api";
import toast from "react-hot-toast";
import { Trash2, Edit3, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);

  const fetchEmployees = async () => {
    try {
      const { data } = await API.get("/employees");
      setEmployees(data);
    } catch {
      toast.error("Failed to fetch employees");
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await API.delete(`/employees/${id}`);
      toast.success("Employee deleted");
      fetchEmployees();
    } catch {
      toast.error("Failed to delete employee");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Employees</h2>
        <Link
          to="/add-employee"
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={18} /> Add Employee
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left text-sm uppercase">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Department</th>
              <th className="p-3">Role</th>
              <th className="p-3">Salary</th>
             {/* <th className="p-3">Last Login</th> */}
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{emp.name}</td>
                <td className="p-3">{emp.email}</td>
                <td className="p-3">{emp.department}</td>
                <td className="p-3">{emp.role}</td>
                <td className="p-3">${emp.salary}</td>
                {/* <td> {new Date(emp.userAccount.lastLogin).toLocaleString()}</td> */}

                <td className="p-3 flex justify-center gap-3">
                  <Link to={`/edit-employee/${emp._id}`} className="text-blue-600">
                    <Edit3 size={18} />
                  </Link>
                  <button
                    onClick={() => deleteEmployee(emp._id)}
                    className="text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {employees.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
