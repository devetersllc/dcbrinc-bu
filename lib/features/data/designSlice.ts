import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface PDFProperties {
  fileType: string;
  pageCount: number;
  fontsEmbedded: boolean;
  layersFlattened: boolean;
  valid: boolean;
  errors: string[];
  dimensions?: {
    width: number;
    height: number;
    unit: string;
  };
}

interface ProcessedPDF {
  properties: PDFProperties;
  pdfDataUrl: string;
  cloudinaryUrl?: string;
  publicId?: string;
  fileName: string;
  fileSize?: number;
  uploadSuccess?: boolean;
}

export interface BookSpecificationsState {
  processing: boolean;
  processedPDF: ProcessedPDF | null;
  bookSize: "a4" | "a5" | "square";
  pageCount: "24" | "30" | "36" | "42" | "48";
  interiorColor: "black-white" | "premium-color";
  paperType: "80lb-white-coated";
  bindingType: "hardcover-case" | "paperback" | "hardcover-linen";
  coverFinish: "glossy" | "matte";
}

const initialState: BookSpecificationsState = {
  processing: false,
  processedPDF: null,
  bookSize: "a4",
  pageCount: "30",
  interiorColor: "black-white",
  paperType: "80lb-white-coated",
  bindingType: "hardcover-linen",
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
    setProcessedPDF: (
      state,
      action: PayloadAction<BookSpecificationsState["processedPDF"]>
    ) => {
      state.processedPDF = action.payload;
    },
    setProcessing: (
      state,
      action: PayloadAction<BookSpecificationsState["processing"]>
    ) => {
      state.processing = action.payload;
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
  setProcessedPDF,
  setProcessing,
} = bookspecificationsSlice.actions;

export default bookspecificationsSlice.reducer;
