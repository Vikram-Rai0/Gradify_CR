import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Dummy data for charts
const submissionTrend = [
  { date: "Aug 25", submissions: 8 },
  { date: "Aug 26", submissions: 12 },
  { date: "Aug 27", submissions: 15 },
  { date: "Aug 28", submissions: 10 },
];

const onTimeLate = [
  { name: "On-time", value: 85 },
  { name: "Late", value: 15 },
];

const gradeDistribution = [
  { grade: "A", count: 12 },
  { grade: "B", count: 18 },
  { grade: "C", count: 8 },
  { grade: "D", count: 2 },
];

const COLORS = ["#22c55e", "#ef4444"];

export default function TeacherDashboard() {
  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          📊 Class Dashboard – <span className="text-indigo-600">Class A</span>
        </h1>
        <button className="px-4 py-2 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-100 transition">
          Date Filter ▼
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Students", value: 42 },
          { label: "Assignments", value: 18 },
          { label: "Submissions", value: 160 },
          { label: "Pending Grading", value: 12 },
        ].map((kpi, idx) => (
          <div
            key={idx}
            className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition"
          >
            <h2 className="text-sm font-medium text-gray-500">{kpi.label}</h2>
            <p className="text-3xl font-semibold text-gray-800 mt-2">
              {kpi.value}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submission Trend */}
        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Submission Trend
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={submissionTrend}>
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="submissions"
                stroke="#4f46e5"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* On-time vs Late */}
        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            On-time vs Late
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={onTimeLate}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {onTimeLate.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Grade Distribution */}
        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Grade Distribution
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={gradeDistribution}>
              <XAxis dataKey="grade" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar
                dataKey="count"
                fill="#10b981"
                radius={[8, 8, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Submissions Table */}
      <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Recent Submissions
        </h2>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-gray-600">
              <th className="p-3">Student</th>
              <th className="p-3">Assignment</th>
              <th className="p-3">Status</th>
              <th className="p-3">Submitted At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="p-3 font-medium text-gray-800">Aarav</td>
              <td className="p-3">Essay 1</td>
              <td className="p-3 text-yellow-600 font-semibold">Pending</td>
              <td className="p-3 text-gray-500">Sep 1, 2025</td>
            </tr>
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="p-3 font-medium text-gray-800">Sita</td>
              <td className="p-3">Math HW</td>
              <td className="p-3 text-green-600 font-semibold">Graded</td>
              <td className="p-3 text-gray-500">Aug 30, 2025</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
