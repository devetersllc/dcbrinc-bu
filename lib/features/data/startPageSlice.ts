import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface StartPageState {
  typeFromQuery: boolean | undefined;
  goalFromQuery: boolean | undefined;
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
    | "Amharic"
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
  typeFromQuery: undefined,
  goalFromQuery: undefined,
  goal: "print",
  type: "print-book",
  projectTitle: "",
  bookLanguage: "English",
  bookCategory: "Non-Fiction",
};

const startpageSlice = createSlice({
  name: "startPage",
  initialState,
  reducers: {
    setGoal: (state, action: PayloadAction<StartPageState["goal"]>) => {
      state.goal = action.payload;
    },
    setTypeFromQuery: (
      state,
      action: PayloadAction<StartPageState["typeFromQuery"]>
    ) => {
      state.typeFromQuery = action.payload;
    },
    setGoalFromQuery: (
      state,
      action: PayloadAction<StartPageState["goalFromQuery"]>
    ) => {
      state.goalFromQuery = action.payload;
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
  setTypeFromQuery,
  setGoal,
  setType,
  setProjectTitle,
  setBookLanguage,
  setBookCategory,
  setGoalFromQuery,
} = startpageSlice.actions;

export default startpageSlice.reducer;
