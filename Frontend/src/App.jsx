import { API_BASE_URL } from "./config";
import {
  Layout,
  Home,
  Resource,
  Subject,
  MockTest,
  Companies,
  Dashboard,
  Profile,
  About,
  Login,
  SignUp,
  AdminQuiz,
  Quiz,
  Compiler,
  AdminCompany,
  AdminResource,
  AdminSubject,
  AdminQuestions,
  AdminAttempts,
  AdminAnalytics,
  FullScreenLayout,
  MockTestRules,
  Users,
  AuditLogs,
  QuizTitles,
  AdminFeedback,
  AdminPage,
  CodingProblems,
  CodingArena,
  AdminCodingProblems,
  AdminProctoringReports,
} from "./Components/routes";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminLayout from "./Components/Admin/AdminLayout";

import UserProtected from "./Components/Protected/UserProtected";
import AdminProtected from "./Components/Protected/AdminProtected";

const companiesLoader = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/company/all`);
    return await res.json();
  } catch (error) {
    console.error("Failed to load companies:", error);
    return [];
  }
};

const subjectsLoader = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/subject/all`);
    return await res.json();
  } catch (error) {
    console.error("Failed to load subjects:", error);
    return [];
  }
};

const resourcesLoader = async ({ params }) => {
  try {
    const res = await fetch(`${API_BASE_URL}/resource/subject/${params.subjectId}`);
    return await res.json();
  } catch (error) {
    console.error("Failed to load resources:", error);
    return [];
  }
};

const router = createBrowserRouter([
  // -----------------------
  // PUBLIC ROUTES
  // -----------------------
  {
    element: <FullScreenLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <SignUp /> },
    ],
  },

  // -----------------------
  // USER PROTECTED ROUTES
  // -----------------------
  {
    element: (
      <UserProtected>
        <Layout />
      </UserProtected>
    ),
    children: [
      { path: "/subject", element: <Subject /> },
      { path: "/resources/:subjectId", element: <Resource /> },
      { path: "/compiler", element: <Compiler /> },
      { path: "/coding", element: <CodingProblems /> },
      { path: "/mocktest", element: <MockTest /> },
       { path: "/titles/:category", element: <QuizTitles /> },
      { path: "/companies", element: <Companies /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/profile", element: <Profile /> },
      { path: "/about", element: <About /> },
    ],
  },

  // FULLSCREEN QUIZ (also protected)
  {
    element: (
      <UserProtected>
        <FullScreenLayout />
      </UserProtected>
    ),
    children: [
      { path: "/rules/:category/:quizId", element: <MockTestRules /> },
      { path: "/quiz/:category/:quizId", element: <Quiz /> },
      { path: "/coding/:problemId", element: <CodingArena /> },
    ],
  },

  // -----------------------
  // ADMIN PROTECTED ROUTES
  // -----------------------
  {
    path: "/admin",
    element: (
      <AdminProtected>
        <AdminLayout />
      </AdminProtected>
    ),
    children: [
      { index: true, element: <AdminPage />, loader: companiesLoader },
      { path: "companies", element: <AdminCompany />, loader: companiesLoader },
      { path: "subjects", element: <AdminSubject />, loader: subjectsLoader },
      {
        path: "resources/:subjectId",
        element: <AdminResource />,
        loader: resourcesLoader,
      },
      { path: "quiz", element: <AdminQuiz /> },
      { path: "coding-problems", element: <AdminCodingProblems /> },
      { path: "questions", element: <AdminQuestions /> },
      { path: "attempts", element: <AdminAttempts /> },
      { path: "analytics", element: <AdminAnalytics /> },
      { path: "users", element: <Users /> },
      {path:"feedback",  element: <AdminFeedback/>},
      { path: "auditlogs", element: <AuditLogs /> },
      { path: "proctoring", element: <AdminProctoringReports /> },
    ],
  },
]);

const App = () => <RouterProvider router={router} />;

export default App;

