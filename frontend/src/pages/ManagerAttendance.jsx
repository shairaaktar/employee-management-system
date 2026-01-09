

import { useEffect, useState } from "react";
import API from "../api";
import toast from "react-hot-toast";
import { CalendarDays, Clock, UserX } from "lucide-react";

export default function ManagerAttendance() {
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({});
  const [latenessMap, setLatenessMap] = useState({});

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const { data } = await API.get("/attendance/manager/team");
      setRecords(data.records || []);
      setSummary(data.summary || {});
      setLatenessMap(data.latenessMap || {});
    } catch {
      toast.error("Failed to load attendance data");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">📊 Team Attendance Overview</h1>

      
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow flex items-center gap-3">
          <CalendarDays className="text-green-500 w-6 h-6" />
          <div>
            <p className="text-gray-500 text-sm">Present</p>
            <h3 className="text-xl font-semibold">{summary.present || 0}</h3>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow flex items-center gap-3">
          <Clock className="text-yellow-500 w-6 h-6" />
          <div>
            <p className="text-gray-500 text-sm">Late</p>
            <h3 className="text-xl font-semibold">{summary.late || 0}</h3>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow flex items-center gap-3">
          <UserX className="text-red-500 w-6 h-6" />
          <div>
            <p className="text-gray-500 text-sm">Absent</p>
            <h3 className="text-xl font-semibold">{summary.absent || 0}</h3>
          </div>
        </div>
      </div>

      
      <div className="bg-white p-5 rounded-xl shadow mb-8">
        <h2 className="text-lg font-semibold mb-3">🚨 Frequent Late/Absent Employees</h2>
        {Object.keys(latenessMap).length === 0 ? (
          <p className="text-gray-500 text-sm">No attendance issues found.</p>
        ) : (
          <table className="min-w-full border">
            <thead className="bg-gray-100 text-gray-600 text-sm">
              <tr>
                <th className="p-2 text-left">Employee</th>
                <th className="p-2 text-left">Late Days</th>
                <th className="p-2 text-left">Absent Days</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(latenessMap).map(([name, counts]) => (
                <tr key={name} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-medium">{name}</td>
                  <td className="p-2">{counts.late}</td>
                  <td className="p-2">{counts.absent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-3">📅 Attendance Records</h2>
        <table className="min-w-full border">
          <thead className="bg-gray-100 text-gray-600 text-sm">
            <tr>
              <th className="p-2 text-left">Employee</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Check-in</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r._id} className="border-b hover:bg-gray-50 text-sm">
                <td className="p-2">{r.user?.name}</td>
                <td className="p-2">{new Date(r.date).toLocaleDateString()}</td>
                <td
                  className={`p-2 font-medium ${
                    r.status === "Absent"
                      ? "text-red-600"
                      : r.status === "Late"
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  {r.status}
                </td>
                <td className="p-2">
                  {r.checkIn ? new Date(r.checkIn).toLocaleTimeString() : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
