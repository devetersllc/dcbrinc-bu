import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface BookSpecificationsState {
  companyName: string;
  name: string;
  phone: number ;
  email: string;
  address: string;
  imageUrl: string | any;
  currentBgColor: string;
  currentTextColor: string;
  jobTitle: string;
  companyMessage: string;
  website?: string;
}

const initialState: BookSpecificationsState = {
  companyName: "",
  name: "",
  imageUrl: 9,
  currentBgColor: "white",
  currentTextColor: "black",
  phone: 0,
  email: "",
  address: "",
  jobTitle: "",
  companyMessage: "",
  website: "",
};

const makeCard = createSlice({
  name: "design",
  initialState,
  reducers: {
    setCompanyName: (
      state,
      action: PayloadAction<BookSpecificationsState["companyName"]>
    ) => {
      state.companyName = action.payload;
    },
    setCompanyMessage: (
      state,
      action: PayloadAction<BookSpecificationsState["companyMessage"]>
    ) => {
      state.companyMessage = action.payload;
    },
    setName: (
      state,
      action: PayloadAction<BookSpecificationsState["name"]>
    ) => {
      state.name = action.payload;
    },
    setWebsite: (
      state,
      action: PayloadAction<BookSpecificationsState["website"]>
    ) => {
      state.website = action.payload;
    },
    setJobTitle: (
      state,
      action: PayloadAction<BookSpecificationsState["jobTitle"]>
    ) => {
      state.jobTitle = action.payload;
    },
    setPhone: (
      state,
      action: PayloadAction<BookSpecificationsState["phone"]>
    ) => {
      state.phone = action.payload;
    },
    setEmail: (
      state,
      action: PayloadAction<BookSpecificationsState["email"]>
    ) => {
      state.email = action.payload;
    },
    setAddress: (
      state,
      action: PayloadAction<BookSpecificationsState["address"]>
    ) => {
      state.address = action.payload;
    },
    setImageUrl: (
      state,
      action: PayloadAction<BookSpecificationsState["imageUrl"]>
    ) => {
      state.imageUrl = action.payload;
    },
    setCurrentBgColor: (
      state,
      action: PayloadAction<BookSpecificationsState["currentBgColor"]>
    ) => {
      state.currentBgColor = action.payload;
    },
    setCurrentTextColor: (
      state,
      action: PayloadAction<BookSpecificationsState["currentTextColor"]>
    ) => {
      state.currentTextColor = action.payload;
    },
  },
});

export const {
  setCompanyName,
  setName,
  setImageUrl,
  setCurrentBgColor,
  setAddress,
  setEmail,
  setPhone,
  setCompanyMessage,
  setJobTitle,
  setWebsite,
  setCurrentTextColor,
} = makeCard.actions;

export default makeCard.reducer;
