import React from 'react';
import { NavLink } from 'react-router-dom';

const subjects = [
  { name: 'Operating Systems', link: '/resources/os', color: 'bg-blue-500' },
  { name: 'DBMS', link: '/resources/dbms', color: 'bg-green-500' },
  { name: 'Computer Networks', link: '/resources/cn', color: 'bg-purple-500' },
  { name: 'Data Structures', link: '/resources/ds', color: 'bg-pink-500' },
  { name: 'Algorithms', link: '/resources/algo', color: 'bg-yellow-500' },
  { name: 'Software Engineering', link: '/resources/se', color: 'bg-indigo-500' },
];

const Resource = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">
        Resources
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {subjects.map((subject) => (
          <NavLink
            key={subject.name}
            to={subject.link}
            className={`flex items-center justify-center h-32 rounded-2xl text-white font-semibold shadow-lg hover:scale-105 transform transition-all ${subject.color}`}
          >
            {subject.name}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Resource;
