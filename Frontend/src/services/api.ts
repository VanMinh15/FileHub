import axios from "axios";
import Cookies from "js-cookie";
import { ApiResponse, ApiResponseData } from "@/utils/api-helpers";

interface UserData {
  id: string;
  email: string;
  userName: string;
}

interface LoginResponse extends ApiResponseData {
  user: UserData;
  token: string;
}

interface RegisterResponse extends ApiResponseData {
  user: UserData;
}
const api = axios.create({
  baseURL: "https://localhost:7145/api/Authentication",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the JWT token in headers
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const login = async (
  email: string,
  password: string
): Promise<ApiResponse<LoginResponse>> => {
  try {
    const response = await api.post<ApiResponse<LoginResponse>>("/login", {
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Login failed",
      data: undefined,
      errors: error.response?.data?.errors || null,
    };
  }
};

export const register = async (
  email: string,
  userName: string,
  password: string
): Promise<ApiResponse<RegisterResponse>> => {
  try {
    const response = await api.post<ApiResponse<RegisterResponse>>(
      "/register",
      {
        email,
        userName,
        password,
      }
    );
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Registration failed",
      data: undefined,
      errors: error.response?.data?.errors || [],
    };
  }
};
