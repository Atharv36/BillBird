import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducer";




import invoiceSlice from "./reducers/invoiceSlice";

export const store = configureStore({
  reducer: {
    auth: userReducer,
    invoice: invoiceSlice,
  },
  devTools: process.env.NODE_ENV !== "production",
});


export default store;