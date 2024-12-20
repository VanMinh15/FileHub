import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login as apiLogin, register as apiRegister } from "@/services/authApi";
import Cookies from "js-cookie";

interface AuthState {
  user: {
    id: string;
    email: string;
    userName: string;
  } | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: Cookies.get("token") || null,
  refreshToken: Cookies.get("refreshToken") || null,
  loading: false,
  error: null,
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

      const { token, refreshToken, user } = response.data;

      // Store tokens in cookies
      Cookies.set("token", token);
      Cookies.set("refreshToken", refreshToken);

      return {
        user,
        token,
        refreshToken,
      };
    } catch (err: any) {
      return rejectWithValue(err.message);
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
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      Cookies.remove("token");
      Cookies.remove("refreshToken");
    },
    clearErrors: (state) => {
      state.error = null;
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
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearErrors } = authSlice.actions;
export default authSlice.reducer;
