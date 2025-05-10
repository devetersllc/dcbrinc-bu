import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Check if we have a user in localStorage when initializing
const initialState: AuthState = {
  user:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null,
  isAuthenticated:
    typeof window !== "undefined" ? !!localStorage.getItem("user") : false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;

      // Save to localStorage for persistence
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(action.payload));
      }
    },
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;

      // Remove from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }
    },
  },
});

export const { setUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
