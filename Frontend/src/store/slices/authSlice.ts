import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  login as apiLogin,
  register as apiRegister,
  googleLogin as apiGoogleLogin,
} from "@/services/authApi";
import Cookies from "js-cookie";

interface UserData {
  id: string;
  email: string;
  userName: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserData | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: Cookies.get("token") || null,
  refreshToken: Cookies.get("refreshToken") || null,
  loading: false,
  error: null,
};

const decodeToken = (token: string): UserData | null => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(jsonPayload);
    return {
      id: payload.sub,
      email: payload.email || "",
      userName:
        payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
        "",
    };
  } catch (e) {
    console.error("Error decoding token:", e);
    return null;
  }
};

export const login = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiLogin(credentials.email, credentials.password);
      if (!response.success || !response.data) {
        return rejectWithValue(response.message || "Login failed");
      }

      const { token, refreshToken } = response.data;
      const userData = decodeToken(token);

      if (!userData) {
        return rejectWithValue("Invalid token data");
      }

      Cookies.set("token", token);
      Cookies.set("refreshToken", refreshToken);

      return {
        user: userData,
        token,
        refreshToken,
      };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (credential: string, { rejectWithValue }) => {
    try {
      const response = await apiGoogleLogin(credential);
      if (response.success && response.data) {
        Cookies.set("token", response.data.token);
        return response.data;
      }
      return rejectWithValue(response.message);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (
    credentials: { email: string; userName: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiRegister(
        credentials.email,
        credentials.userName,
        credentials.password
      );
      if (!response.success || !response.data) {
        return rejectWithValue(response.message || "Registration failed");
      }
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<UserData>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      Cookies.remove("token");
      Cookies.remove("refreshToken");
      state.loading = false;
      localStorage.removeItem("token");
    },
    clearErrors: (state) => {
      state.error = null;
    },
    initializeFromToken: (state) => {
      const token = Cookies.get("token");
      if (token) {
        const userData = decodeToken(token);
        if (userData) {
          state.user = userData;
          state.isAuthenticated = true;
          state.token = token;
          state.refreshToken = Cookies.get("refreshToken") || null;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearErrors, loginSuccess, initializeFromToken } =
  authSlice.actions;
export default authSlice.reducer;
