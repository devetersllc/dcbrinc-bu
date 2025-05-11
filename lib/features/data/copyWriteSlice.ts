import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Contributor {
  id: number;
  role: string;
  firstName: string;
  lastName: string;
}

export interface CopyWriteSliceState {
  title: string;
  subtitle: string;
  edition: string;
  editionStatement: string;
  contributors: Contributor[];
  copyrightOption: "all-rights" | "creative-commons" | "public-domain";
  copyrightHolder: string;
  copyrightYear: string;
  isbnOption: "free-isbn" | "own-isbn" | "proceed-without";
  ownIsbnValue: string;
}

const initialState: CopyWriteSliceState = {
  title: "",
  subtitle: "",
  edition: "",
  editionStatement: "",
  contributors: [
    { id: 1, role: "By (author)", firstName: "Cecilia", lastName: "RAZA" },
  ],
  copyrightOption: "all-rights",
  copyrightHolder: "",
  copyrightYear: "",
  isbnOption: "proceed-without",
  ownIsbnValue: "",
};

const copywritesliceSlice = createSlice({
  name: "copyWrite",
  initialState,
  reducers: {
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setSubtitle: (state, action: PayloadAction<string>) => {
      state.subtitle = action.payload;
    },
    setEdition: (state, action: PayloadAction<string>) => {
      state.edition = action.payload;
    },
    setEditionStatement: (state, action: PayloadAction<string>) => {
      state.editionStatement = action.payload;
    },
    addContributor: (state) => {
      const newId =
        state.contributors.length > 0
          ? Math.max(...state.contributors.map((c) => c.id)) + 1
          : 1;
      state.contributors.push({
        id: newId,
        role: "By (author)",
        firstName: "",
        lastName: "",
      });
    },
    removeContributor: (state, action: PayloadAction<number>) => {
      state.contributors = state.contributors.filter(
        (c) => c.id !== action.payload
      );
    },
    updateContributor: (
      state,
      action: PayloadAction<{
        id: number;
        field: keyof Contributor;
        value: string;
      }>
    ) => {
      state.contributors = state.contributors.map((c) =>
        c.id === action.payload.id
          ? { ...c, [action.payload.field]: action.payload.value }
          : c
      );
    },
    setCopyrightOption: (
      state,
      action: PayloadAction<"all-rights" | "creative-commons" | "public-domain">
    ) => {
      state.copyrightOption = action.payload;
    },
    setCopyrightHolder: (state, action: PayloadAction<string>) => {
      state.copyrightHolder = action.payload;
    },
    setCopyrightYear: (state, action: PayloadAction<string>) => {
      state.copyrightYear = action.payload;
    },
    setIsbnOption: (
      state,
      action: PayloadAction<"free-isbn" | "own-isbn" | "proceed-without">
    ) => {
      state.isbnOption = action.payload;
    },
    setOwnIsbnValue: (state, action: PayloadAction<string>) => {
      state.ownIsbnValue = action.payload;
    },
  },
});

export const {
  setTitle,
  setSubtitle,
  setEdition,
  setEditionStatement,
  addContributor,
  removeContributor,
  updateContributor,
  setCopyrightOption,
  setCopyrightHolder,
  setCopyrightYear,
  setIsbnOption,
  setOwnIsbnValue,
} = copywritesliceSlice.actions;

export default copywritesliceSlice.reducer;
