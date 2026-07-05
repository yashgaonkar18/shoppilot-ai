import api from "./axios";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getProducts = () =>
  api.get("/products", authHeader());

export const getSales = () =>
  api.get("/sales", authHeader());

export const getInvoices = () =>
  api.get("/invoices", authHeader());