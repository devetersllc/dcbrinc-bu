import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface PDFProperties {
  fileType: string | null;
  pageCount: number | null;
  fontsEmbedded: boolean | null;
  layersFlattened: boolean | null;
  valid: boolean;
  errors: string[];
  dimensions?: {
    width: number;
    height: number;
    unit: string;
  } | null;
}

interface ProcessedPDF {
  properties: PDFProperties;
  pdfDataUrl: string;
  cloudinaryUrl?: string;
  publicId?: string;
  fileName: string | undefined;
  fileSize?: number;
  uploadSuccess?: boolean;
}

interface ProcessedCover {
  properties: PDFProperties;
  coverDataUrl: string;
  cloudinaryUrl?: string;
  publicId?: string;
  coverFileName: string | undefined;
  fileSize?: number | undefined;
  uploadSuccess?: boolean;
}

export interface BookSpecificationsState {
  processing: boolean;
  processedPDF: ProcessedPDF | null;
  processingCover: boolean;
  processedCover: ProcessedCover | null;
  bookSize: "a4" | "a5" | "square";
  pageCount: "24" | "30" | "36" | "42" | "48";
  interiorColor: "black-white" | "premium-color" | "";
  paperType: "80lb-white-coated" | "";
  bindingType: "hardcover-case" | "paperback" | "hardcover-linen" | "";
  coverFinish: "glossy" | "matte" | "";
  totalPrice: number;
}

const initialState: BookSpecificationsState = {
  processing: false,
  processedPDF: null,
  processingCover: false,
  processedCover: null,
  bookSize: "a4",
  pageCount: "30",
  // interiorColor: "",
  // paperType: "",
  // bindingType: "",
  // coverFinish: "",
  // totalPrice: 0,
  interiorColor: "black-white",
  paperType: "80lb-white-coated",
  bindingType: "hardcover-case",
  coverFinish: "glossy",
  totalPrice: 1,
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
    setProcessingCover: (
      state,
      action: PayloadAction<BookSpecificationsState["processingCover"]>
    ) => {
      state.processingCover = action.payload;
    },
    setProcessedCover: (
      state,
      action: PayloadAction<BookSpecificationsState["processedCover"]>
    ) => {
      state.processedCover = action.payload;
    },
    setTotalPrice: (
      state,
      action: PayloadAction<BookSpecificationsState["totalPrice"]>
    ) => {
      state.totalPrice = action.payload;
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
  setProcessedCover,
  setProcessingCover,
  setTotalPrice,
} = bookspecificationsSlice.actions;

export default bookspecificationsSlice.reducer;
