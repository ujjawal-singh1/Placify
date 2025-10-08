import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  // Temporary mock data for testing
  useEffect(() => {
    const tempData = {
      totalExams: 12,
      completed: 8,
      averageScore: '78%',
    };
    setStats(tempData);
  }, []);

  if (!stats) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 dark:text-gray-300 text-xl">Loading...</p>
      </div>
    );
  }

  const pieData = [
    { name: 'Completed', value: stats.completed },
    { name: 'Pending', value: stats.totalExams - stats.completed },
  ];

  const COLORS = ['#4ade80', '#f87171']; // green/red

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">
        Welcome to Your Dashboard 🎯
      </h1>

      {/* Stats Cards with Interactive Click */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard
          title="Total Exams"
          value={stats.totalExams}
          onClick={() => alert('Navigate to /exams')}
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          onClick={() => alert('Navigate to /completed')}
        />
        <div
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow flex flex-col items-center justify-center transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 cursor-pointer"
          onClick={() => alert('Navigate to /progress')}
        >
          <h3 className="text-gray-600 dark:text-gray-400 text-sm mb-2">Progress</h3>
          <ResponsiveContainer width={120} height={120}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={50}
                startAngle={90}
                endAngle={-270}
                paddingAngle={2}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-gray-800 dark:text-gray-100 mt-2 font-bold">
            {stats.completed}/{stats.totalExams} Completed
          </p>
        </div>
      </div>

      {/* Average Score Animated Progress */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow mb-10">
        <h3 className="text-gray-600 dark:text-gray-400 text-sm mb-2">Average Score</h3>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6 overflow-hidden">
          <div
            className="bg-blue-600 h-6 rounded-full text-white text-center font-semibold transition-all duration-1000"
            style={{ width: stats.averageScore }}
          >
            {stats.averageScore}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Quick Access
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <QuickLink to="/mocktest" label="Mock Test" color="bg-blue-600" />
          <QuickLink to="/resource" label="Resources" color="bg-green-600" />
          <QuickLink to="/companies" label="Companies" color="bg-purple-600" />
          <QuickLink to="/profile" label="Profile" color="bg-pink-600" />
        </div>
      </section>
    </main>
  );
};

const StatCard = ({ title, value, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow flex flex-col items-center justify-center transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 cursor-pointer"
  >
    <h3 className="text-gray-600 dark:text-gray-400 text-sm">{title}</h3>
    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-2">{value}</p>
  </div>
);

const QuickLink = ({ to, label, color }) => (
  <NavLink
    to={to}
    className={`flex items-center justify-center p-6 rounded-2xl text-white font-semibold shadow hover:opacity-90 transform hover:scale-105 transition ${color}`}
  >
    {label}
  </NavLink>
);

export default Dashboard;
