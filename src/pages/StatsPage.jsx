import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#4ade80", "#f87171"]; // green for correct, red for incorrect

const StatsPage = () => {
  const [stats, setStats] = useState({ totalTime: 0, wordsPracticed: [] });
  const [error, setError] = useState("");
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const fetchStats = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) throw new Error("VITE_API_URL is not defined in .env");
        const response = await axios.get(`${apiUrl}/api/user/stats`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        console.log("Stats response:", {
          status: response.status,
          data: response.data,
        });
        setStats(response.data || { totalTime: 0, wordsPracticed: [] });
      } catch (err) {
        const errorMsg =
          err.response?.data?.error ||
          err.message ||
          "Failed to load statistics";
        console.error("Fetch stats error:", err);
        setError(errorMsg);
      }
    };
    fetchStats();
  }, [user, navigate]);

  const handleResetStats = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      await axios.delete(`${apiUrl}/api/user/stats/reset`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      console.log("Stats reset requested");
      setStats({ totalTime: 0, wordsPracticed: [] });
      localStorage.removeItem("submittedWordIds");
    } catch (err) {
      console.error(
        "Reset stats error:",
        err.response?.data?.error || err.message
      );
      setError("Failed to reset stats");
    }
  };

  const groupedStats = stats.wordsPracticed.reduce((acc, attempt) => {
    const group = attempt.group || "Ungrouped";
    if (!acc[group]) acc[group] = { correct: 0, incorrect: 0, total: 0 };
    acc[group].total += 1;
    acc[group][attempt.correct ? "correct" : "incorrect"] += 1;
    return acc;
  }, {});

  const totalWords = stats.wordsPracticed.length;
  const totalCorrect = stats.wordsPracticed.filter((a) => a.correct).length;
  const totalIncorrect = totalWords - totalCorrect;
  const accuracy =
    totalWords > 0 ? Math.round((totalCorrect / totalWords) * 100) : 0;

  const pieData = [
    { name: "Correct", value: totalCorrect },
    { name: "Incorrect", value: totalIncorrect },
  ];

  const barData = Object.keys(groupedStats).map((group) => ({
    name: group,
    Correct: groupedStats[group].correct,
    Incorrect: groupedStats[group].incorrect,
  }));

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center text-black">
        Error: {error}
      </div>
    );
  }

  console.log("Pie chart data:", pieData);
  console.log("Bar chart data:", barData);

  return (
    <div className="mt-12 px-4 w-full max-w-5xl mx-auto space-y-8">
      <div className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-black">
        <h2 className="text-2xl font-bold text-center mb-6 tracking-tight">
          Learning Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center text-sm md:text-base">
          <div className="bg-white/20 p-4 rounded-xl">
            <p className="font-medium text-gray-700">Total Time Spent</p>
            <p className="font-semibold text-lg">
              {formatTime(stats.totalTime)}
            </p>
          </div>
          <div className="bg-white/20 p-4 rounded-xl">
            <p className="font-medium text-gray-700">Words Practiced</p>
            <p className="font-semibold text-lg">{totalWords}</p>
          </div>
          <div className="bg-white/20 p-4 rounded-xl">
            <p className="font-medium text-gray-700">Correct</p>
            <p className="font-semibold text-green-600 text-lg">
              {totalCorrect} ({accuracy}%)
            </p>
          </div>
          <div className="bg-white/20 p-4 rounded-xl">
            <p className="font-medium text-gray-700">Incorrect</p>
            <p className="font-semibold text-red-500 text-lg">
              {totalIncorrect} (
              {totalWords > 0
                ? Math.round((totalIncorrect / totalWords) * 100)
                : 0}
              %)
            </p>
          </div>
        </div>
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-center mb-4 text-gray-800">
            Overall Accuracy
          </h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid rgba(209, 213, 219, 0.3)",
                    borderRadius: "8px",
                    color: "#1F2937",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-center mb-4 text-gray-800">
            Group Performance
          </h3>
          <div className="w-full h-80 overflow-x-auto">
            <div className="min-w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(209,213,219,0.2)"
                  />
                  <XAxis
                    dataKey="name"
                    interval={0} // show all labels
                    angle={-45} // tilt them diagonally
                    textAnchor="end"
                    height={80}
                    stroke="#1F2937"
                    fontSize={11}
                  />
                  <YAxis allowDecimals={false} stroke="#1F2937" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid rgba(209, 213, 219, 0.3)",
                      borderRadius: "8px",
                      color: "#1F2937",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="Correct" stackId="a" fill="#4ade80" />
                  <Bar dataKey="Incorrect" stackId="a" fill="#f87171" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="mt-12 space-y-4">
          {Object.keys(groupedStats)
            .sort()
            .map((group) => (
              <div
                key={group}
                className="bg-white/20 border border-white/30 rounded-xl p-4"
              >
                <p className="text-sm font-medium text-gray-900">{group}</p>
                <p className="text-sm text-gray-700">
                  Words Practiced: {groupedStats[group].total}
                </p>
                <p className="text-sm text-gray-700">
                  Correct: {groupedStats[group].correct} (
                  {groupedStats[group].total > 0
                    ? Math.round(
                        (groupedStats[group].correct /
                          groupedStats[group].total) *
                          100
                      )
                    : 0}
                  %)
                </p>
                <p className="text-sm text-gray-700">
                  Incorrect: {groupedStats[group].incorrect} (
                  {groupedStats[group].total > 0
                    ? Math.round(
                        (groupedStats[group].incorrect /
                          groupedStats[group].total) *
                          100
                      )
                    : 0}
                  %)
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
