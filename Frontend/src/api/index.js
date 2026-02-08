import api from "./Axios";

/* ================= AUTH ================= */

export const loginAPI = (data) =>
  api.post("/api/auth/signin", data);

export const registerAPI = (data) =>
  api.post("/api/auth/register", data);

export const logoutAPI = () =>
  api.post("/api/auth/signout");

export const fetchUserAPI = () =>
  api.get("/api/auth/user");

/* ================= INVOICE ================= */

export const getInvoicesAPI = () =>
  api.get("/api/invoice/all");


export const getInvoicesPaginatedAPI = (page = 0, size = 5) =>
  api.get(`/api/invoice/paginated?page=${page}&size=${size}`);


export const downloadInvoicePdfAPI = (invoiceId) =>
  api.get(`/api/invoice/${invoiceId}/pdf`, {
    responseType: "blob", // IMPORTANT
  });

export const generatePreviewPdfAPI = (invoiceData) =>
  api.post("/api/invoice/pdf", {
    invoiceNumber: invoiceData.invoiceNumber || "PREVIEW",
    invoiceJson: invoiceData
  }, {
    responseType: "blob", // IMPORTANT for PDF
  });

  export const createInvoice = async (formData) => {
  const res = await api.post("/api/invoice/create", {
    invoiceJson: formData
  });
  return res.data;
};

export const updateInvoiceAPI = (invoiceId, formData) =>
  api.put(`/api/invoice/${invoiceId}`, {
    invoiceJson: formData
  });

export const deleteInvoiceAPI = (invoiceId) =>
  api.delete(`/api/invoice/${invoiceId}`);

export const getInvoiceByIdAPI = (invoiceId) =>
  api.get(`/api/invoice/${invoiceId}`);

export const updateUserAPI = (userData) =>
  api.put("/api/auth/user", userData);
