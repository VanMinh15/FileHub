import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login as apiLogin, register as apiRegister } from "@/services/api";
import Cookies from "js-cookie";

// Define the state interface
interface AuthState {
  user: {
    id: string;
    email: string;
    userName: string;
  } | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Define initial state
const initialState: AuthState = {
  user: null,
  token: Cookies.get("token") || null,
  loading: false,
  error: null,
};

// Async thunk for login
export const login = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiLogin(credentials.email, credentials.password);
      if (!response.success || !response.data) {
        const errorMessage =
          response.data?.errors?.[0]?.description ||
          response.errors?.[0] ||
          response.message ||
          "Login failed";
        return rejectWithValue(errorMessage);
      }
      Cookies.set("token", response.data.token);
      return {
        user: response.data.user,
        token: response.data.token,
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
        const errorMessage =
          response.data?.errors?.[0]?.description ||
          response.errors?.[0] ||
          response.message ||
          "Registration failed";
        return rejectWithValue(errorMessage);
      }
      return {
        user: response.data.user,
      };
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
      Cookies.remove("token");
    },
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login cases
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Register cases
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.user || null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearErrors } = authSlice.actions;
export default authSlice.reducer;
