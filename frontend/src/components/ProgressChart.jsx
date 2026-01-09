import { PieChart, Pie, Cell, Legend } from "recharts";

export default function ProgressChart({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const todo = total - completed - inProgress;

  const data = [
    { name: "Completed", value: completed },
    { name: "In Progress", value: inProgress },
    { name: "To Do", value: todo },
  ];

  const COLORS = ["#22c55e", "#eab308", "#3b82f6"]; // green, yellow, blue

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-xl font-bold mb-4">Task Progress</h2>
      {total === 0 ? (
        <p className="text-gray-500">No tasks yet</p>
      ) : (
        <PieChart width={300} height={250}>
          <Pie
            data={data}
            cx={150}
            cy={100}
            innerRadius={50}
            outerRadius={80}
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      )}
    </div>
  );
}
