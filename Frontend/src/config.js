// Centralized API configuration
// In production, set VITE_API_URL environment variable
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// ML microservice (Python/FastAPI) — runs alongside the Spring Boot backend
export const ML_SERVICE_URL = import.meta.env.VITE_ML_URL || "http://localhost:5000";
