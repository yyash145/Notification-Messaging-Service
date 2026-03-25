import axiosInstance from "./axiosInterface";
const BASE_URL = "http://localhost:3000"; // your NestJS backend

export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("Login failed");

  return res.json();
};

export const signupUser = async (data: any) => {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Signup failed");

  return res.json();
};


export const refreshAccessToken = async (refreshToken: string) => {
  const response = await axiosInstance.post(`${BASE_URL}/auth/refresh`, {
    refreshToken: refreshToken,
  });
  console.log("AuthAPi Response -", response.data)
  return response.data;
};