import { configureStore } from "@reduxjs/toolkit"
import authReducer from "@/lib/features/auth/authSlice"
import startPageReducer from "@/lib/features/data/startPageSlice";
import copyWriteSliceReducer from "@/lib/features/data/copyWriteSlice";
import designReducer from "@/lib/features/data/design";
import detailReducer from "@/lib/features/data/detail";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    startPage: startPageReducer,
    copyWrite: copyWriteSliceReducer,
    design: designReducer,
    detail: detailReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
