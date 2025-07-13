import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface GeneralState {
  activeTab: number;
  areFieldsEmptyCheck: boolean;
  serviceType: "books" | "cards";
}

const initialState: GeneralState = {
  activeTab: 0,
  areFieldsEmptyCheck: true,
  serviceType: "books",
};

const startpageSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<GeneralState["activeTab"]>) => {
      state.activeTab = action.payload;
    },
    setServiceType: (
      state,
      action: PayloadAction<GeneralState["serviceType"]>
    ) => {
      state.serviceType = action.payload;
    },
    setAreFieldsEmptyCheck: (state, action: PayloadAction<boolean>) => {
      state.areFieldsEmptyCheck = action.payload;
    },
  },
});

export const { setActiveTab, setAreFieldsEmptyCheck, setServiceType } =
  startpageSlice.actions;

export default startpageSlice.reducer;
