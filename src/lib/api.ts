// Keep the backend URL in one place.
// Local development: http://localhost:5000
// Production: set NEXT_PUBLIC_API_URL in the frontend environment.
export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");
