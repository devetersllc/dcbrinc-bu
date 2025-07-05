import { configureStore } from "@reduxjs/toolkit"
import authReducer from "@/lib/features/auth/authSlice"
import startPageReducer from "@/lib/features/data/startPageSlice";
import copyWriteSliceReducer from "@/lib/features/data/copyWriteSlice";
import designReducer from "@/lib/features/data/designSlice";
import detailReducer from "@/lib/features/data/detailSlice";
import priceReducer from "@/lib/features/data/priceSlice";
import generalReducer from "@/lib/features/general/general";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    startPage: startPageReducer,
    copyWrite: copyWriteSliceReducer,
    design: designReducer,
    detail: detailReducer,
    price: priceReducer,
    general: generalReducer,
  },
  devTools: process.env.NODE_ENV !== "sandbox",
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
