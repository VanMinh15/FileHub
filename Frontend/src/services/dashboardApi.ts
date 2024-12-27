import axios from "axios";
import Cookies from "js-cookie";
import { ApiResponse } from "@/utils/api-types";
import { store } from "@/store/store";
import { logout } from "@/store/slices/authSlice";

interface ReceiverSearchParams {
  keyword: string;
  pageIndex: number;
  pageSize: number;
}

interface Receiver {
  id: string;
  userName: string;
  email: string;
}

const dashboardApi = axios.create({
  baseURL: "https://localhost:7145/api/User",
  headers: {
    "Content-Type": "application/json",
  },
});

dashboardApi.interceptors.request.use(
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
dashboardApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = Cookies.get("refreshToken");

      try {
        const response = await axios.post<
          ApiResponse<{ token: string; refreshToken: string }>
        >("https://localhost:7145/api/Authentication/refresh-token", {
          refreshToken,
        });

        if (response.data.success && response.data.data) {
          const { token, refreshToken } = response.data.data;
          Cookies.set("token", token);
          Cookies.set("refreshToken", refreshToken);
          dashboardApi.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${token}`;
          return dashboardApi(originalRequest);
        } else {
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

export const searchReceivers = async (
  params: ReceiverSearchParams
): Promise<ApiResponse<Receiver[]>> => {
  try {
    const { keyword, pageIndex, pageSize } = params;

    const response = await dashboardApi.post(
      "/search-receiver",
      {},
      {
        params: {
          keyword: keyword || "",
          PageIndex: pageIndex,
          PageSize: pageSize,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to search receivers",
      data: [],
      errors: error.response?.data?.errors || [],
    };
  }
};

export default dashboardApi;
