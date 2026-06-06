import AdminLayout from "../Components/Admin/AdminLayout";
import { AdminCompany } from "../Components";
import AdminSubject from "../Components";
import AdminResource from "../Components";
import { API_BASE_URL } from "../config";

// Load companies data from backend
export async function companiesLoader() {
  try {
    const res = await fetch(`${API_BASE_URL}/company/all`);
    return await res.json();
  } catch (error) {
    console.error("Failed to load companies:", error);
    return [];
  }
}

// Load subjects data from backend
export async function subjectsLoader() {
  try {
    const res = await fetch(`${API_BASE_URL}/subject/all`);
    return await res.json();
  } catch (error) {
    console.error("Failed to load subjects:", error);
    return [];
  }
}

// Load resources by subject
export async function resourcesLoader({ params }) {
  try {
    const res = await fetch(`${API_BASE_URL}/resource/subject/${params.subjectId}`);
    return await res.json();
  } catch (error) {
    console.error("Failed to load resources:", error);
    return [];
  }
}

export const adminRoutes = {
  path: "/admin",
  element: <AdminLayout />,
  children: [
    { index: true, element: <AdminCompany />, loader: companiesLoader },
    { path: "companies", element: <AdminCompany />, loader: companiesLoader },
    { path: "subjects", element: <AdminSubject />, loader: subjectsLoader },
    { path: "resources/:subjectId", element: <AdminResource />, loader: resourcesLoader }
  ],
};
