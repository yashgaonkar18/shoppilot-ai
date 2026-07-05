import api from "./axios";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getInvoices = () =>
  api.get("/invoices", authHeader());

export const getInvoiceById = (id: string) =>
  api.get(`/invoices/${id}`, authHeader());

export const deleteInvoice = (id: string) =>
  api.delete(`/invoices/${id}`, authHeader());