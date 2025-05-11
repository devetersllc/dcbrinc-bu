import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface DetailState {
  description: string;
  contributorNotes: string;
  tableOfContents: string;
}

const initialState: DetailState = {
  description: "",
  contributorNotes: "",
  tableOfContents: "",
};

const detailSlice = createSlice({
  name: "detail",
  initialState,
  reducers: {
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    setContributorNotes: (state, action: PayloadAction<string>) => {
      state.contributorNotes = action.payload;
    },
    setTableOfContents: (state, action: PayloadAction<string>) => {
      state.tableOfContents = action.payload;
    },
  },
});

export const { setDescription, setContributorNotes, setTableOfContents } =
  detailSlice.actions;

export default detailSlice.reducer;
