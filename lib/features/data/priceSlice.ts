import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface PriceState {
  priceBy: string;
  revenuePrice: number | null;
  listPrices: { [currency: string]: number | null };
  firstName: string;
  lastName: string;
  isOrganization: boolean;
  organizationName: string;
  country: string;
  state: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
  currency: string;
  paymentMethod: string;
  paypalEmail: string;
  taxIdNumber: string;
  nonUsTaxIdNumber: string;
  taxFormStatus: string;
}

const initialState: PriceState = {
  priceBy: "revenue-goal",
  revenuePrice: null,
  listPrices: {
    USD: null,
    EUR: null,
    AUD: null,
    GBP: null,
    CAD: null,
  },
  firstName: "",
  lastName: "",
  isOrganization: false,
  organizationName: "",
  country: "",
  state: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  postalCode: "",
  phone: "",
  email: "",
  currency: "USD",
  paymentMethod: "paypal",
  paypalEmail: "",
  taxIdNumber: "",
  nonUsTaxIdNumber: "",
  taxFormStatus: "No Submission",
};

const priceSlice = createSlice({
  name: "price",
  initialState,
  reducers: {
    setPriceBy(state, action: PayloadAction<string>) {
      state.priceBy = action.payload;
    },
    setRevenuePrice(state, action: PayloadAction<PriceState["revenuePrice"]>) {
      state.revenuePrice = action.payload;
    },
    setCurrency(state, action: PayloadAction<string>) {
      state.currency = action.payload;
    },
    setListPrice(
      state,
      action: PayloadAction<{ currency: string; value: number }>
    ) {
      const { currency, value } = action.payload;
      state.listPrices[currency] = value;
    },
    setFirstName(state, action: PayloadAction<string>) {
      state.firstName = action.payload;
    },
    setLastName(state, action: PayloadAction<string>) {
      state.lastName = action.payload;
    },
    setIsOrganization(state, action: PayloadAction<boolean>) {
      state.isOrganization = action.payload;
    },
    setOrganizationName(state, action: PayloadAction<string>) {
      state.organizationName = action.payload;
    },
    setCountry(state, action: PayloadAction<string>) {
      state.country = action.payload;
    },
    setState(state, action: PayloadAction<string>) {
      state.state = action.payload;
    },
    setAddressLine1(state, action: PayloadAction<string>) {
      state.addressLine1 = action.payload;
    },
    setAddressLine2(state, action: PayloadAction<string>) {
      state.addressLine2 = action.payload;
    },
    setCity(state, action: PayloadAction<string>) {
      state.city = action.payload;
    },
    setPostalCode(state, action: PayloadAction<string>) {
      state.postalCode = action.payload;
    },
    setPhone(state, action: PayloadAction<string>) {
      state.phone = action.payload;
    },
    setEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
    setPaymentMethod(state, action: PayloadAction<string>) {
      state.paymentMethod = action.payload;
    },
    setPaypalEmail(state, action: PayloadAction<string>) {
      state.paypalEmail = action.payload;
    },
    setTaxIdNumber(state, action: PayloadAction<string>) {
      state.taxIdNumber = action.payload;
    },
    setNonUsTaxIdNumber(state, action: PayloadAction<string>) {
      state.nonUsTaxIdNumber = action.payload;
    },
    setTaxFormStatus(state, action: PayloadAction<string>) {
      state.taxFormStatus = action.payload;
    },
    resetPriceState() {
      return initialState;
    },
  },
});

export const {
  setPriceBy,
  setRevenuePrice,
  setCurrency,
  setListPrice,
  setFirstName,
  setLastName,
  setIsOrganization,
  setOrganizationName,
  setCountry,
  setState,
  setAddressLine1,
  setAddressLine2,
  setCity,
  setPostalCode,
  setPhone,
  setEmail,
  setPaymentMethod,
  setPaypalEmail,
  setTaxIdNumber,
  setNonUsTaxIdNumber,
  setTaxFormStatus,
  resetPriceState,
} = priceSlice.actions;

export default priceSlice.reducer;
