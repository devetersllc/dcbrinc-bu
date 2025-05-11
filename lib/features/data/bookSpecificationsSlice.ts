import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface BookSpecificationsState {
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

const initialState: BookSpecificationsState = {
  goal: "publish",
  type: "print-book",
  projectTitle: "",
  bookLanguage: "Akkadian",
  bookCategory: "Fiction",
};

const bookspecificationsSlice = createSlice({
  name: "bookSpecifications",
  initialState,
  reducers: {
    setGoal: (state, action: PayloadAction<BookSpecificationsState["goal"]>) => {
      state.goal = action.payload;
    },
    setType: (state, action: PayloadAction<BookSpecificationsState["type"]>) => {
      state.type = action.payload;
    },
    setProjectTitle: (
      state,
      action: PayloadAction<BookSpecificationsState["projectTitle"]>
    ) => {
      state.projectTitle = action.payload;
    },
    setBookLanguage: (
      state,
      action: PayloadAction<BookSpecificationsState["bookLanguage"]>
    ) => {
      state.bookLanguage = action.payload;
    },
    setBookCategory: (
      state,
      action: PayloadAction<BookSpecificationsState["bookCategory"]>
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
} = bookspecificationsSlice.actions;

export default bookspecificationsSlice.reducer;
