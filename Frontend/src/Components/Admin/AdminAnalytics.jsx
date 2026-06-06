import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { API_BASE_URL } from "../../config";

const AdminAnalytics = ({ quizId }) => {
  const [data, setData] = useState([]);
  const backend = API_BASE_URL;

  useEffect(() => {
    fetch(`${backend}/quiz/attempts/quiz/${quizId}`)
      .then(r => r.json())
      .then(attempts => {
        // aggregate scores distribution
        const buckets = {};
        attempts.forEach(a => {
          const score = a.score;
          buckets[score] = (buckets[score] || 0) + 1;
        });
        const chartData = Object.entries(buckets).map(([score, count]) => ({ score, count }));
        setData(chartData);
      });
  }, [quizId]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Quiz Analytics</h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="score" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminAnalytics;
