import { useEffect, useState } from "react";
import API from "../api";
import toast from "react-hot-toast";
import { Trash2, Edit3, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function DepartmentList() {
  const [departmentlist, setDepartmentlist] = useState([]);

  const fetchDepartments = async () => {
    try {
      const { data } = await API.get("/admin/departments");
      setDepartmentlist(data);
    } catch {
      toast.error("Failed to fetch Departments");
    }
  };

  const deleteDepartment = async (id) => {
    try {
      await API.delete(`/admin/departments/${id}`);
      toast.success("Department deleted");
      fetchEmployees();
    } catch {
      toast.error("Failed to delete department");
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div className="p-4 md:p-8">
     

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left text-sm uppercase">
              <th className="p-3">Name</th>
              
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departmentlist.map((dep) => (
              <tr key={dep._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{dep.name}</td>
               
             

                <td className="p-3 flex justify-center gap-3">
                  <Link to={`/edit-employee/${dep._id}`} className="text-blue-600">
                    <Edit3 size={18} />
                  </Link>
                  <button
                    onClick={() => deleteDepartment(dep._id)}
                    className="text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {departmentlist.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No department found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
