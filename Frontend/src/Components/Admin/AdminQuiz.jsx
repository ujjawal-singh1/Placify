import React, { useState, useEffect } from "react";

const AdminQuiz = () => {
  const [categories, setCategories] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [message, setMessage] = useState("");

  const backendUrl = "http://localhost:8080"; // change if needed

  // Fetch categories
  useEffect(() => {
    fetch(`${backendUrl}/quiz/category`, { method: "POST" })
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch all quizzes
  const fetchQuizzes = () => {
    fetch(`${backendUrl}/quiz/all`) // create this backend endpoint to fetch all quizzes
      .then((res) => res.json())
      .then((data) => setQuizzes(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleCreateQuiz = () => {
    fetch(
      `${backendUrl}/quiz/create?category=${selectedCategory}&numQ=${numQuestions}&title=${quizTitle}`,
      { method: "POST" }
    )
      .then((res) => res.text())
      .then((data) => {
        setMessage(data);
        fetchQuizzes(); // refresh list
      })
      .catch((err) => console.error(err));
  };

  const handleDeleteQuiz = (id) => {
    fetch(`${backendUrl}/quiz/remove/${id}`, { method: "DELETE" })
      .then((res) => res.text())
      .then((data) => {
        setMessage(data);
        fetchQuizzes();
      })
      .catch((err) => console.error(err));
  };

  const handleUpdateTitle = (id, newTitle) => {
    fetch(`${backendUrl}/quiz/update/${id}?title=${newTitle}`, { method: "PUT" })
      .then((res) => res.text())
      .then((data) => {
        setMessage(data);
        fetchQuizzes();
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-pink-200 to-orange-200">
      <h1 className="text-4xl font-bold text-black mb-6 text-center">Admin Quiz Dashboard</h1>

      {/* Create Quiz */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6 max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Create New Quiz</h2>

        <div className="mb-3">
          <label className="block mb-1">Category:</label>
          <select
            className="w-full p-2 border rounded"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">-- Select --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="block mb-1">Quiz Title:</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1">Number of Questions:</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={numQuestions}
            onChange={(e) => setNumQuestions(e.target.value)}
          />
        </div>

        <button
          onClick={handleCreateQuiz}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Create Quiz
        </button>

        {message && <p className="mt-2 text-green-700">{message}</p>}
      </div>

      {/* List Quizzes */}
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Existing Quizzes</h2>
        {quizzes.length === 0 && <p>No quizzes found.</p>}
        <ul className="space-y-4">
          {quizzes.map((quiz) => (
            <li key={quiz.id} className="flex justify-between items-center border p-3 rounded">
              <div>
                <p className="font-semibold">{quiz.title}</p>
                <p className="text-sm text-gray-600">{quiz.category}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    const newTitle = prompt("Enter new title", quiz.title);
                    if (newTitle) handleUpdateTitle(quiz.id, newTitle);
                  }}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteQuiz(quiz.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminQuiz;
