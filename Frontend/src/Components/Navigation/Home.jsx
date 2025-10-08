import React from 'react'
import { NavLink } from 'react-router-dom'

const Home = () => {
  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100">
            Smart Code Evaluation &amp; Exam Portal
          </h1>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-2xl p-8 grid gap-8 md:grid-cols-2">
          {/* Left: summary */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
              Overview
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              A local, cost-effective web platform that automates code evaluation and
              provides AI-powered camera proctoring for secure programming exams.
              Students attempt exams in-browser, code gets automatically executed and
              evaluated, and teachers get instant results with proctoring logs.
            </p>

            <div className="mt-6">
              <h3 className="font-medium text-gray-800 dark:text-gray-100">Key goals</h3>
              <ul className="mt-3 list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                <li>Automatic, test-case based code evaluation with partial scoring.</li>
                <li>Real-time AI camera monitoring (WebRTC + OpenCV + MTCNN).</li>
                <li>Role-based access with Spring Security + JWT.</li>
                <li>Local deployment (no cloud required) for labs/classrooms.</li>
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <NavLink
                to="/dashboard"
                className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
              >
                Go to Dashboard
              </NavLink>
              <NavLink
                to="/login"
                className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100"
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100"
              >
                Sign Up
              </NavLink>
            </div>
          </div>

          {/* Right: features + tech */}
          <aside>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Features</h3>
            <div className="space-y-3">
              <Feature
                title="Integrated Code Editor"
                desc="React + Monaco/CodeMirror editor inside the portal for writing code."
              />
              <Feature
                title="Isolated Execution"
                desc="Run submissions inside Docker containers to sandbox code."
              />
              <Feature
                title="Automatic Scoring"
                desc="Compare outputs with hidden and public test cases; partial marks supported."
              />
              <Feature
                title="AI Proctoring"
                desc="WebRTC stream analyzed with OpenCV + MTCNN to detect anomalies and log events."
              />
              <Feature
                title="Reports & Logs"
                desc="Comprehensive exam reports and proctoring logs for teachers."
              />
            </div>

            <h3 className="mt-6 text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Tech stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                'Spring Boot',
                'MongoDB',
                'React',
                'WebRTC',
                'OpenCV',
                'Docker',
                'MTCNN',
                'JWT',
              ].map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-200"
                >
                  {t}
                </span>
              ))}
            </div>
          </aside>
        </div>

        {/* Team */}
        <section className="mt-10 bg-white dark:bg-gray-800 shadow rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Team</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Member name="Mana Panda" role="Team Member" roll="10800222093" />
            <Member name="Shubham Sharma" role="Team Member" roll="10800222081" />
            <Member name="Rohit Soni" role="Team Member" roll="10800222029" />
            <Member name="Ujjawal Kumar" role="Team Member" roll="10800222083" />
          </div>
        </section>
      </section>
    </main>
  )
}

/* Subcomponents */
const Feature = ({ title, desc }) => (
  <div className="p-3 border border-gray-100 dark:border-gray-700 rounded-lg">
    <h4 className="font-medium text-gray-800 dark:text-gray-100">{title}</h4>
    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{desc}</p>
  </div>
)

const Member = ({ name, role, roll }) => (
  <div className="p-4 rounded-lg border border-gray-100 dark:border-gray-700">
    <p className="font-semibold text-gray-800 dark:text-gray-100">{name}</p>
    <p className="text-sm text-gray-600 dark:text-gray-300">{role}</p>
    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Roll: {roll}</p>
  </div>
)

export default Home
