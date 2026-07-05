import api from "./axios";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const chatAI = (prompt: string) =>
  api.post(
    "/ai/chat",
    { prompt },
    authHeader()
  );

  export const getBusinessInsights = () => api.get("/ai/insights");