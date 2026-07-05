import api from "./axios";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getSales = () =>
  api.get("/sales", authHeader());

export const createSale = (data: any) =>
  api.post("/sales", data, authHeader());

export const deleteSale = (id: string) =>
  api.delete(`/sales/${id}`, authHeader());