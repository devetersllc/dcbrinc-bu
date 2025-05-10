import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface StartPageState {
  gaol: string;
}

const initialState: StartPageState = {
  gaol: "",
};

const startpageSlice = createSlice({
  name: "startPage",
  initialState,
  reducers: {
    setGoal: (state, action: PayloadAction<string>) => {
      state.gaol = action.payload;
    },
  },
});

export const { setGoal } = startpageSlice.actions;
export default startpageSlice.reducer;
