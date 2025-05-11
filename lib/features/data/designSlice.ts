import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface BookSpecificationsState {
  bookSize: "a4" | "a5" | "square";
  pageCount: "24" | "30" | "36" | "42" | "48";
  interiorColor: "black-white" | "premium-color";
  paperType: "80lb-white-coated";
  bindingType: "hardcover-case" | "paperback" | "hardcover-linen";
  coverFinish: "glossy" | "matte";
}

const initialState: BookSpecificationsState = {
  bookSize: "a4",
  pageCount: "30",
  interiorColor: "black-white",
  paperType: "80lb-white-coated",
  bindingType: "hardcover-case",
  coverFinish: "glossy",
};

const bookspecificationsSlice = createSlice({
  name: "design",
  initialState,
  reducers: {
    setBookSize: (
      state,
      action: PayloadAction<BookSpecificationsState["bookSize"]>
    ) => {
      state.bookSize = action.payload;
    },
    setPageCount: (
      state,
      action: PayloadAction<BookSpecificationsState["pageCount"]>
    ) => {
      state.pageCount = action.payload;
    },
    setInteriorColor: (
      state,
      action: PayloadAction<BookSpecificationsState["interiorColor"]>
    ) => {
      state.interiorColor = action.payload;
    },
    setPaperType: (
      state,
      action: PayloadAction<BookSpecificationsState["paperType"]>
    ) => {
      state.paperType = action.payload;
    },
    setBindingType: (
      state,
      action: PayloadAction<BookSpecificationsState["bindingType"]>
    ) => {
      state.bindingType = action.payload;
    },
    setCoverFinish: (
      state,
      action: PayloadAction<BookSpecificationsState["coverFinish"]>
    ) => {
      state.coverFinish = action.payload;
    },
  },
});

export const {
  setBookSize,
  setPageCount,
  setInteriorColor,
  setPaperType,
  setBindingType,
  setCoverFinish,
} = bookspecificationsSlice.actions;

export default bookspecificationsSlice.reducer;
