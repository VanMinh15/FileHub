import axios from "axios";
import Cookies from "js-cookie";
import { ApiResponse } from "@/types/api-types";
import { store } from "@/store/store";
import { logout } from "@/store/slices/authSlice";
import { Activity } from "@/types/activity-types";

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

interface PaginationParams {
  pageIndex: number;
  pageSize: number;
}

interface ChatActivity {
  id: number;
  name: string;
  type: "File" | "Folder";
  action: string;
  userName: string;
  createdAt: string;
  fileType?: string;
  size?: number;
  itemCount?: number | null;
  permission: string;
  metadata: {
    FileType?: string;
    Size?: string;
    Version: string;
  };
}

interface InfiniteScrollList<T> {
  items: T[];
  hasMore: boolean;
  lastTimestamp: string | undefined;
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

export const getRecentActivities = async (
  params: PaginationParams
): Promise<ApiResponse<Activity[]>> => {
  try {
    const response = await axios.get(
      "https://localhost:7145/api/File/recent-activities",
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        params: {
          PageIndex: params.pageIndex,
          PageSize: params.pageSize,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch activities:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to fetch recent activities. Please try again later.",
      data: [],
      errors: error.response?.data?.errors || [],
    };
  }
};

export const getChatHistory = async (
  senderId: string,
  receiverId: string,
  before?: string,
  pageSize: number = 20
): Promise<ApiResponse<InfiniteScrollList<ChatActivity>>> => {
  try {
    const response = await axios.get(
      "https://localhost:7145/api/File/chat-history",
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        params: {
          senderID: senderId,
          receiverID: receiverId,
          before,
          pageSize,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch chat history",
      data: {
        items: [],
        hasMore: false,
        lastTimestamp: undefined,
      },
      errors: error.response?.data?.errors || [],
    };
  }
};

export default dashboardApi;
