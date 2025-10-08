import React, { useState } from 'react';

const Profile = () => {
  // Initial mock user data
  const [user, setUser] = useState({
    name: 'Ujjawal Kumar',
    email: 'ujjawal.kumar@example.com',
    avatar: 'https://i.pravatar.cc/150?img=3',
    totalExams: 12,
    completed: 8,
    averageScore: '78%',
  });

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...user });

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save changes
  const handleSave = () => {
    setUser({ ...formData });
    setEditMode(false);
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData({ ...user });
    setEditMode(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">
        Profile
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-6">
          {/* Avatar */}
          <img
            src={formData.avatar}
            alt="avatar"
            className="w-24 h-24 rounded-full border-4 border-blue-500"
          />

          {/* User Info */}
          <div className="flex-1">
            {editMode ? (
              <div className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                  placeholder="Name"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                  placeholder="Email"
                />
                <input
                  type="text"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                  placeholder="Avatar URL"
                />
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {user.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 text-center">
          <div className="bg-blue-500 text-white rounded-xl p-4 shadow">
            <h3 className="text-sm">Total Exams</h3>
            <p className="text-2xl font-bold">{user.totalExams}</p>
          </div>
          <div className="bg-green-500 text-white rounded-xl p-4 shadow">
            <h3 className="text-sm">Completed</h3>
            <p className="text-2xl font-bold">{user.completed}</p>
          </div>
          <div className="bg-purple-500 text-white rounded-xl p-4 shadow">
            <h3 className="text-sm">Average Score</h3>
            <p className="text-2xl font-bold">{user.averageScore}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-400 text-white rounded-xl shadow hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
