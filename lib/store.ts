import { configureStore } from "@reduxjs/toolkit"
import authReducer from "@/lib/features/auth/authSlice"
import startPageReducer from "@/lib/features/data/startPageSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    startPage: startPageReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
