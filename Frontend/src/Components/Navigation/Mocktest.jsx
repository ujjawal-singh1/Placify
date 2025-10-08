import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MockTest = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories from backend
    fetch('http://localhost:8080/quiz/category', {
      method: 'Get', // your backend uses POST for /quiz/category
      headers: { 'Content-Type': 'application/json' }
    })
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error('Failed to fetch categories:', err));
  }, []);

  const startQuiz = (category) => {
    // Ideally, call backend to create a quiz and get quizId
    const quizId = '12345'; // placeholder ID for now
    navigate(`/quiz/${category}/${quizId}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-200 to-orange-200 p-6">
      <h1 className="text-4xl font-bold text-black mb-6">Select a Category</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
        {categories.length === 0 ? (
          <p className="text-black text-center col-span-full">Loading categories...</p>
        ) : (
          categories.map((cat) => (
            <div
              key={cat}
              className="bg-white p-6 rounded-xl shadow-lg cursor-pointer hover:scale-105 transition transform text-black text-center font-semibold"
              onClick={() => startQuiz(cat)}
            >
              {cat}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MockTest;
