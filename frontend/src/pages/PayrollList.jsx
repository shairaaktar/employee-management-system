// import { useEffect, useState } from "react";
// import API from "../api";
// import toast from "react-hot-toast";
// import { CheckCircle } from "lucide-react";
// import { Link } from "react-router-dom";

// export default function PayrollList() {
//   const [payrolls, setPayrolls] = useState([]);

//   const fetchPayrolls = async () => {
//     const { data } = await API.get("/payrolls");
//     setPayrolls(data);
//   };

//   const markPaid = async (id) => {
//     try {
//       await API.put(`/payrolls/${id}/pay`);
//       toast.success("Marked as paid");
//       fetchPayrolls();
//     } catch {
//       toast.error("Failed to mark payment");
//     }
//   };

//   useEffect(() => {
//     fetchPayrolls();
//   }, []);

//   return (
//     <div className="p-4 md:p-8">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold">Payroll Records</h2>
//         <Link
//           to="/add-payroll"
//           className="bg-green-500 text-white px-4 py-2 rounded"
//         >
//           + Add Payroll
//         </Link>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white shadow rounded-lg">
//           <thead>
//             <tr className="bg-gray-100 text-left text-sm uppercase">
//               <th className="p-3">Employee</th>
//               <th className="p-3">Month</th>
//               <th className="p-3">Base</th>
//               <th className="p-3">Bonus</th>
//               <th className="p-3">Deductions</th>
//               <th className="p-3">Net Salary</th>
//               <th className="p-3 text-center">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {payrolls.map((p) => (
//               <tr key={p._id} className="border-b hover:bg-gray-50">
//                 <td className="p-3">{p.employee?.name}</td>
//                 <td className="p-3">{p.month}</td>
//                 <td className="p-3">${p.baseSalary}</td>
//                 <td className="p-3">${p.bonus}</td>
//                 <td className="p-3">${p.deductions}</td>
//                 <td className="p-3 font-semibold">${p.netSalary}</td>
//                 <td className="p-3 text-center">
//                   {p.paid ? (
//                     <span className="text-green-600 font-semibold">Paid</span>
//                   ) : (
//                     <button
//                       onClick={() => markPaid(p._id)}
//                       className="text-blue-600 hover:text-blue-800 flex items-center gap-1 justify-center"
//                     >
//                       <CheckCircle size={16} /> Mark Paid
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//             {payrolls.length === 0 && (
//               <tr>
//                 <td colSpan="7" className="text-center p-4 text-gray-500">
//                   No payroll records found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

//  import { useState, useEffect } from "react";
//  import API from "../api";
//  import toast from "react-hot-toast";

//  export default function PayrollList() {
//    const [payrolls, setPayrolls] = useState([]);
//    const [month, setMonth] = useState("");
//    const [loading, setLoading] = useState(false);

//    const fetchPayrolls = async () => {
//      const res = await API.get("/payrolls");
//      setPayrolls(res.data);
//    };

//    const approvePayroll=async(id)=>{
//      try{
//        await API.put(`/payrolls/${id}/approve`);
//      toast.success("Payroll approved and payment initiated!");
//      fetchPayrolls();

//      }catch(err){
//        toast.error(err.response?.data?.message || "Error approving payroll");


//      }
//    }

//    const generatePayroll = async () => {
//      if (!month) return alert("Please enter month (e.g. October 2025)");
//      try {
//        setLoading(true);
//        await API.post("/payrolls/generate", { month });
//        fetchPayrolls();
//      } catch (err) {
//        alert(err.response?.data?.message || "Error generating payroll");
//      } finally {
//        setLoading(false);
//      }
//    };

//    const markAsPaid = async (id) => {
//      await API.put(`/payrolls/${id}/pay`);
//      fetchPayrolls();
//    };

//    useEffect(() => {
//      fetchPayrolls();
//    }, []);

//    return (
//      <div>
//        <h1 className="text-3xl font-bold mb-6">Payroll Management</h1>

//        <div className="flex gap-3 mb-6">
//          <input
//            type="text"
//            placeholder="Enter month (e.g. October 2025)"
//            value={month}
//            onChange={(e) => setMonth(e.target.value)}
//            className="border px-3 py-2 rounded"
//          />
//          <button
//            onClick={generatePayroll}
//            disabled={loading}
//            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//          >
//            Generate Payroll
//          </button>
//        </div>

//        <div className="grid gap-3">
//          {payrolls.map((p) => (
//            <div
//              key={p._id}
//              className="bg-white/60 dark:bg-gray-800/50 p-4 rounded-lg shadow flex justify-between items-center"
//            >
//              <div>
//                <p className="font-semibold">{p.employee?.name}</p>
//                <p className="text-sm text-gray-500">
//                  {p.month} — {p.employee?.department}
//                </p>
//                <p className="text-xs">
//                  Present: {p.presentDays}, Leave: {p.leaveDays}
//                </p>
//              </div>
//              <div className="text-right">
//                <p className="font-bold">${p.finalSalary.toFixed(2)}</p>
//                <p
//                  className={`text-xs ${
//                    p.status === "Paid" ? "text-green-500" : "text-yellow-500"
//                  }`}
//                >
//                  {p.status}
//                </p>
//                {p.status !== "Paid" && (
//                  <button
//                    onClick={() => approvePayroll(p._id)}
//                    className="bg-green-500 text-white text-sm px-3 py-1 rounded mt-1"
//                  >
//                    Mark Paid
//                  </button>
//                )}
//              </div>
//            </div>
//          ))}
//        </div>
//      </div>
//    );
//  }

 import { useEffect, useState } from "react";
 import API from "../api";
 import toast from "react-hot-toast";
 import { CheckCircle, Edit, Save } from "lucide-react";
import PayslipModal from "../components/PayslipModal";

 export default function PayrollList() {
   const [payrolls, setPayrolls] = useState([]);
   const [editingId, setEditingId] = useState(null);
   const [editValues, setEditValues] = useState({ bonus: 0, deductions: 0 });
   const [month, setMonth] = useState("");
   const [loading, setLoading] = useState(false);
   const [selectedPdf,setSelectedPdf]=useState(null);

   async function fetchPayrolls() {
     const { data } = await API.get("/payrolls");
     setPayrolls(data);
   }

   useEffect(() => {
     fetchPayrolls();
   }, []);

   const handleEdit = (p) => {
     setEditingId(p._id);
     setEditValues({ bonus: p.bonus || 0, deductions: p.deductions || 0 });
   };

   const saveEdit = async (id) => {
     try {
       await API.put(`/payrolls/${id}`, editValues);
       toast.success("Payroll updated");
       setEditingId(null);
       fetchPayrolls();
     } catch {
       toast.error("Update failed");
     }
   };

 const generatePayroll = async () => {
      if (!month) return alert("Please enter month (e.g. October 2025)");
      try {
        setLoading(true);
        await API.post("/payrolls/generate", { month });
        fetchPayrolls();
      } catch (err) {
        alert(err.response?.data?.message || "Error generating payroll");
      } finally {
        setLoading(false);
      }
    };


   const approvePayroll = async (id) => {
     try {
       await API.put(`/payrolls/${id}/approve`);
       toast.success(" Payroll Approved & Employee Notified");
       fetchPayrolls();
     } catch {
       toast.error("Failed to approve payroll");
     }
   };

   return (
     <div className="p-6 bg-base-200 min-h-screen">
       <h2 className="text-2xl font-bold mb-6">HR Payroll Management</h2>
          <div className="flex gap-3 mb-6">
          <input
            type="month"
            placeholder="Enter month (e.g. October 2025)"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border px-3 py-2 rounded"
          />
          <button
            onClick={generatePayroll}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Generate Payroll
          </button>
        </div>

       <div className="overflow-x-auto">
         <table className="table w-full bg-base-100 shadow rounded-lg">
           <thead>
             <tr className="bg-base-300">
               <th>Employee</th>
               <th>Department</th>
               <th>Month</th>
               <th>Base Salary</th>
               <th>Bonus</th>
               <th>Deductions</th>
               <th>Final Salary</th>
               <th>Status</th>
               <th>PaymentIntent</th>
               
               <th className="text-center">Actions</th>
               
             </tr>
           </thead>
           <tbody>
             {payrolls.map((p) => (
               <tr key={p._id}>
                 <td>{p.employee?.name}</td>
                 <td>{p.employee?.department}</td>
                
                     {/* <p className="text-sm text-gray-500">
                  {p.month} — {p.employee?.department}
                </p> */}
                 <td>{p.month}</td>
                 <td>${p.baseSalary}</td>

                 <td>
                   {editingId === p._id ? (
                     <input
                       type="number"
                       name="bonus"
                       value={editValues.bonus}
                       onChange={(e) =>
                         setEditValues({
                           ...editValues,
                           bonus: e.target.value,
                         })
                       }
                       className="input input-bordered input-sm w-20"
                     />
                   ) : (
                     `$${p.bonus || 0}`
                   )}
                 </td>

                 <td>
                   {editingId === p._id ? (
                     <input
                       type="number"
                       name="deductions"
                       value={editValues.deductions}
                       onChange={(e) =>
                         setEditValues({
                           ...editValues,
                           deductions: e.target.value,
                         })
                       }
                       className="input input-bordered input-sm w-20"
                     />
                   ) : (
                     `$${p.deductions || 0}`
                   )}
                 </td>

                 <td className="font-semibold text-green-600">
                   ${p.finalSalary}
                 </td>

                 <td>
                   <span
                     className={`badge ${
                       p.status === "Approved"
                         ? "badge-success"
                         : "badge-warning"
                     }`}
                   >
                     {p.status || "Pending"}
                   </span>
                 </td>
                   <td className="text-sm text-gray-700">{p.paymentIntentId || "—"}</td>

                 <td className="flex gap-2 justify-center">
                   {editingId === p._id ? (
                     <button
                       onClick={() => saveEdit(p._id)}
                       className="btn btn-sm btn-success"
                     >
                       <Save size={16} /> Save
                     </button>
                   ) : (
                     <>
                       {p.status!=="Approved" &&(
                        <button
                         onClick={() => handleEdit(p)}
                         className="btn btn-sm btn-outline"
                       >
                         <Edit size={16} /> Edit
                       </button>
                       )}
                       {p.status !== "Approved" && (
                         <button
                           onClick={() => approvePayroll(p._id)}
                           className="btn btn-sm btn-primary"
                         >
                           <CheckCircle size={16} /> Approve
                         </button>
                       )}
                       

                     </>
                   )}
                    
<td>
  {p.receiptUrl ? (
                    <button
                      onClick={() =>
                        setSelectedPdf(`http://localhost:5000${p.receiptUrl}`)
                      }
                      className="text-blue-600 hover:underline"
                    >
                      View Payslip
                    </button>
                  ) : (
                    <span className="text-gray-400 text-sm">N/A</span>
                  )}
</td>
                 </td>
              
               </tr>
             ))}
           </tbody>
         </table>
       </div>
      {selectedPdf && (
  <PayslipModal
    isOpen={!!selectedPdf}
    pdfUrl={selectedPdf}
    onClose={() => setSelectedPdf(null)}
  />
)}

     </div>
   );
 }
