import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Quiz = () => {
  const { category, quizId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    fetch(`http://localhost:8080/quiz/quiz/${quizId}`)
      .then(res => res.json())
      .then(data => setQuestions(data))
      .catch(err => console.error(err));
  }, [quizId]);

  useEffect(() => {
    if (!questions.length || score !== null) return;
    if (timeLeft <= 0) handleNext();
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, questions, score]);

  const handleOptionSelect = (index) => setSelected(index);

  const handleNext = () => {
    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
      setTimeLeft(60);
    } else submitQuiz();
  };

  const submitQuiz = () => {
    const payload = questions.map((q, i) => ({
      questionId: q.id,
      response: selected
    }));
    fetch(`http://localhost:8080/quiz/submit/${quizId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => setScore(data))
      .catch(err => console.error(err));
  };

  if (!questions.length) return <p className="text-black text-center mt-10">Loading...</p>;
  if (score !== null) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-4xl mb-4">Score: {score}/{questions.length}</h1>
      <button
        className="px-6 py-3 bg-orange-500 rounded hover:bg-orange-600 transition"
        onClick={() => window.location.reload()}
      >
        Restart
      </button>
    </div>
  );

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center bg-gradient-to-b from-pink-200 via-white to-orange-200">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4 text-black">Category: {category}</h2>
        <h3 className="mb-4 text-black">Question {currentQ + 1}: {questions[currentQ].quetionTitle}</h3>

        <div className="space-y-3">
          {[questions[currentQ].option1, questions[currentQ].option2, questions[currentQ].option3, questions[currentQ].option4].map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionSelect(idx)}
              className={`w-full px-4 py-2 rounded text-left border ${
                selected === idx ? 'bg-pink-500 text-white border-pink-600' : 'bg-white text-black border-gray-400'
              } hover:bg-orange-500 hover:text-white transition`}
            >
              {opt}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={selected === null}
          className="mt-6 w-full px-4 py-2 rounded text-white bg-black disabled:bg-gray-400 hover:bg-orange-600 transition"
        >
          {currentQ + 1 === questions.length ? 'Submit' : 'Next'}
        </button>

        <p className="mt-2 text-black font-semibold">Time Left: {timeLeft}s</p>
      </div>
    </div>
  );
};

export default Quiz;
