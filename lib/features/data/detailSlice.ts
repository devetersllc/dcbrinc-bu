import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface DetailState {
  description: string;
  contributorNotes: string;
  tableOfContents: string;
  luluCategory: string;
  bisacMain: string;
  bisacCategory2: string;
  bisacCategory3: string;
  keywords: string;
  audience: string;
  isExplicitContent: boolean;
  explicitContentType: string;
}

const initialState: DetailState = {
  description: "",
  contributorNotes: "",
  tableOfContents: "",
  luluCategory: "non-fiction",
  bisacMain: "",
  bisacCategory2: "",
  bisacCategory3: "",
  keywords: "",
  audience: "general-trade",
  isExplicitContent: true,
  explicitContentType: "any-adult",
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
    setLuluCategory: (state, action: PayloadAction<string>) => {
      state.luluCategory = action.payload;
    },
    setBisacMain: (state, action: PayloadAction<string>) => {
      state.bisacMain = action.payload;
    },
    setBisacCategory2: (state, action: PayloadAction<string>) => {
      state.bisacCategory2 = action.payload;
    },
    setBisacCategory3: (state, action: PayloadAction<string>) => {
      state.bisacCategory3 = action.payload;
    },
    setKeywords: (state, action: PayloadAction<string>) => {
      state.keywords = action.payload;
    },
    setAudience: (state, action: PayloadAction<string>) => {
      state.audience = action.payload;
    },
    setIsExplicitContent: (state, action: PayloadAction<boolean>) => {
      state.isExplicitContent = action.payload;
    },
    setExplicitContentType: (state, action: PayloadAction<string>) => {
      state.explicitContentType = action.payload;
    },
  },
});

export const {
  setDescription,
  setContributorNotes,
  setTableOfContents,
  setLuluCategory,
  setBisacMain,
  setBisacCategory2,
  setBisacCategory3,
  setKeywords,
  setAudience,
  setIsExplicitContent,
  setExplicitContentType,
} = detailSlice.actions;

export default detailSlice.reducer;
