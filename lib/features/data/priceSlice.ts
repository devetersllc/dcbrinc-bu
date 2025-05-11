import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface PriceState {
  priceBy: string;
  revenuePrice: number | null;
  currency: string;
  listPrices: { [currency: string]: number | null };
}

const initialState: PriceState = {
  priceBy: "revenue-goal",
  revenuePrice: null,
  currency: "USD",
  listPrices: {
    USD: null,
    EUR: null,
    AUD: null,
    GBP: null,
    CAD: null,
  },
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
  },
});

export const { setPriceBy, setRevenuePrice, setCurrency, setListPrice } =
  priceSlice.actions;
export default priceSlice.reducer;
