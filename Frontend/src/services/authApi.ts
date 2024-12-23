import axios from "axios";
import Cookies from "js-cookie";
import { ApiResponse, ApiResponseData } from "@/utils/api-helpers";
import { store } from "@/store/store";
import { logout } from "@/store/slices/authSlice";

interface UserData {
  id: string;
  email: string;
  userName: string;
}

interface TokenData {
  token: string;
  refreshToken: string;
}

interface LoginResponse extends ApiResponseData, TokenData {
  user: UserData;
}

interface GoogleLoginResponse extends ApiResponseData {
  token: string;
  refreshToken: string;
  user: UserData;
}

interface RegisterResponse extends ApiResponseData {
  user: UserData;
}

interface ForgotPasswordResponse extends ApiResponseData {
  message: string;
}

interface ResetPasswordResponse extends ApiResponseData {
  message: string;
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

// Add refresh token interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = Cookies.get("refreshToken");

      try {
        const response = await api.post<ApiResponse<TokenData>>(
          "/refresh-token",
          {
            refreshToken,
          }
        );

        if (response.data.success && response.data.data) {
          const { token, refreshToken } = response.data.data;

          Cookies.set("token", token);
          Cookies.set("refreshToken", refreshToken);

          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          return api(originalRequest);
        } else {
          // Refresh token is invalid/expired, logout user
          store.dispatch(logout());
          return Promise.reject(error);
        }
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
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
      errors: error.response?.data?.errors || [],
    };
  }
};

export const googleLogin = async (
  idToken: string
): Promise<ApiResponse<GoogleLoginResponse>> => {
  try {
    const response = await api.post<ApiResponse<GoogleLoginResponse>>(
      "/google-login",
      { idToken }
    );
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Google login failed",
      data: undefined,
      errors: error.response?.data?.errors || [],
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

export const forgotPassword = async (
  email: string
): Promise<ApiResponse<ForgotPasswordResponse>> => {
  try {
    const response = await api.post<ApiResponse<ForgotPasswordResponse>>(
      "/forgot-password",
      { email }
    );
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to send reset email",
      data: undefined,
      errors: error.response?.data?.errors || [],
    };
  }
};

export const resetPassword = async (
  email: string,
  token: string,
  newPassword: string,
  confirmPassword: string
): Promise<ApiResponse<ResetPasswordResponse>> => {
  try {
    const response = await api.post<ApiResponse<ResetPasswordResponse>>(
      "/reset-password",
      {
        email,
        token,
        newPassword,
        confirmPassword,
      }
    );
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Password reset failed",
      data: undefined,
      errors: error.response?.data?.errors || [],
    };
  }
};
export default api;
