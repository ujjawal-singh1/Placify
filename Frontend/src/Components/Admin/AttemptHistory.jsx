import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config";

const AttemptHistory = ({ quizId }) => {
  const [attempts, setAttempts] = useState([]);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const backend = API_BASE_URL;

  useEffect(() => {
    fetch(`${backend}/quiz/attempts/quiz/${quizId}`)
      .then(r => r.json()).then(setAttempts).catch(console.error);
  }, [quizId]);

  const openProctorLogs = (attempt) => {
    fetch(`${backend}/quiz/proctor/attempt/${attempt.id}`)
      .then(r => r.json())
      .then(logs => {
        // show in modal (simple)
        setSelectedAttempt({ attempt, logs });
      });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Attempts for Quiz</h2>

      <div className="space-y-3">
        {attempts.map(a => (
          <div key={a.id} className="p-3 bg-white rounded flex justify-between">
            <div>
              <div className="font-semibold">{a.userId}</div>
              <div className="text-sm text-gray-600">{new Date(a.timestamp).toLocaleString()} • Score: {a.score}/{a.total}</div>
            </div>
            <div>
              <button onClick={()=>openProctorLogs(a)} className="px-3 py-1 bg-blue-600 text-white rounded">View Proctor</button>
            </div>
          </div>
        ))}
      </div>

      {selectedAttempt && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6">
          <div className="bg-white p-6 rounded shadow max-w-2xl w-full">
            <h3 className="font-bold mb-3">Proctor Logs — {selectedAttempt.attempt.userId}</h3>
            <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-auto">
              {selectedAttempt.logs.map((log) => (
                <div key={log.id} className="p-2 border rounded">
                  {log.imageBase64 ? <img src={log.imageBase64} alt="snap" /> : <div className="text-sm text-gray-500">{log.issue}</div>}
                  <div className="text-xs text-gray-500 mt-1">{new Date(log.timestamp).toLocaleString()}</div>
                </div>
              ))}
            </div>
            <button onClick={()=>setSelectedAttempt(null)} className="mt-4 btn-secondary">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttemptHistory;
