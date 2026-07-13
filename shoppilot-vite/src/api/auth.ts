import api from "./axios";

export interface RegisterData {
  email: string;
  password: string;
  shop_name: string;
  owner_name: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// Register
export const registerUser = (data: RegisterData) => {
  return api.post("/auth/register", data);
};

// Login
export const loginUser = (data: LoginData) => {
  return api.post("/auth/login", data);
};


export const getProfile = (token: string) => {
  return api.get("/auth/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const updateProfile = (data: {
  shop_name: string;
  owner_name: string;
  phone: string;
}) => api.put("/auth/profile", data, authHeader());

// Forgot Password API helper calls
export const forgotPasswordUser = (data: { email: string }) => {
  return api.post("/auth/forgot-password", data);
};

export const verifyOTPUser = (data: { email: string; otp: string }) => {
  return api.post("/auth/verify-otp", data);
};

export const resetPasswordUser = (data: {
  email: string;
  otp: string;
  newPassword: string;
}) => {
  return api.post("/auth/reset-password", data);
};