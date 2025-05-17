import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface GeneralState {
  activeTab: number;
  areFieldsEmptyCheck: boolean;
}

const initialState: GeneralState = {
  activeTab: 0,
  areFieldsEmptyCheck: true,
};

const startpageSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<GeneralState["activeTab"]>) => {
      state.activeTab = action.payload;
    },
    setAreFieldsEmptyCheck: (state, action: PayloadAction<boolean>) => {
      state.areFieldsEmptyCheck = action.payload;
    },
  },
});

export const { setActiveTab, setAreFieldsEmptyCheck } = startpageSlice.actions;

export default startpageSlice.reducer;
