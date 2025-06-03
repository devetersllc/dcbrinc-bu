import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface StartPageState {
  goal: "publish" | "print";
  type:
    | "print-book"
    | "photo-book"
    | "comic-book"
    | "magazine"
    | "yearbook"
    | "calendar"
    | "ebook";
  projectTitle: string;
  bookLanguage:
    | "Akkadian"
    | "Akkadian"
    | "English"
    | "Spanish"
    | "French"
    | "German"
    | "Japanese";

  bookCategory:
    | "Fiction"
    | "Non-Fiction"
    | "Art & Photography"
    | "Travel"
    | "Cookbook"
    | "Biography";
}

const initialState: StartPageState = {
  goal: "print",
  type: "print-book",
  projectTitle: "anything---",
  bookLanguage: "Akkadian",
  bookCategory: "Fiction",
};

const startpageSlice = createSlice({
  name: "startPage",
  initialState,
  reducers: {
    setGoal: (state, action: PayloadAction<StartPageState["goal"]>) => {
      state.goal = action.payload;
    },
    setType: (state, action: PayloadAction<StartPageState["type"]>) => {
      state.type = action.payload;
    },
    setProjectTitle: (
      state,
      action: PayloadAction<StartPageState["projectTitle"]>
    ) => {
      state.projectTitle = action.payload;
    },
    setBookLanguage: (
      state,
      action: PayloadAction<StartPageState["bookLanguage"]>
    ) => {
      state.bookLanguage = action.payload;
    },
    setBookCategory: (
      state,
      action: PayloadAction<StartPageState["bookCategory"]>
    ) => {
      state.bookCategory = action.payload;
    },
  },
});

export const {
  setGoal,
  setType,
  setProjectTitle,
  setBookLanguage,
  setBookCategory,
} = startpageSlice.actions;

export default startpageSlice.reducer;
