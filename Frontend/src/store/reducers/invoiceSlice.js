import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getInvoicesPaginatedAPI, deleteInvoiceAPI } from "../../api";
import toast from 'react-hot-toast';

export const fetchInvoices = createAsyncThunk(
  "invoice/fetchInvoices",
  async ({ page = 0, size = 5 }, { rejectWithValue }) => {
    try {
      const res = await getInvoicesPaginatedAPI(page, size);
      return res.data;
    } catch (err) {
      const backend = err.response?.data;
      const message =
        (backend && typeof backend === "object" && (backend.message || backend.error)) ||
        (typeof backend === "string" ? backend : null) ||
        "Failed to load invoices";
      return rejectWithValue(message);
    }
  }
);

export const deleteInvoice = createAsyncThunk(
  "invoice/deleteInvoice",
  async (invoiceId, { rejectWithValue }) => {
    try {
      await deleteInvoiceAPI(invoiceId);
      return invoiceId;
    } catch (err) {
      const backend = err.response?.data;
      const message =
        (backend && typeof backend === "object" && (backend.message || backend.error)) ||
        (typeof backend === "string" ? backend : null) ||
        "Failed to delete invoice";
      return rejectWithValue(message);
    }
  }
);

const invoiceSlice = createSlice({
  name: "invoice",
  initialState: {
    list: [],
    loading: false,
    error: null,
    currentPage: 0,
    totalPages: 0,
    deleting: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.content;
        state.currentPage = action.payload.number;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload, {
          icon: '❌',
        });
      })
      .addCase(deleteInvoice.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.deleting = false;
        state.list = state.list.filter((invoice) => invoice.id !== action.payload);
        toast.success('Invoice deleted successfully!', {
          icon: '🗑️',
        });
      })
      .addCase(deleteInvoice.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
        toast.error(action.payload, {
          icon: '❌',
        });
      });
  },
});

export const { clearError } = invoiceSlice.actions;
export default invoiceSlice.reducer;
