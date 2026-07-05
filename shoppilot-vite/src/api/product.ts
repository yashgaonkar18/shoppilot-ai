import api from "./axios";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getProducts = () =>
  api.get("/products", authHeader());

export const createProduct = (data: any) =>
  api.post("/products", data, authHeader());

export const updateProduct = (id: string, data: any) =>
  api.put(`/products/${id}`, data, authHeader());

export const deleteProduct = (id: string) =>
  api.delete(`/products/${id}`, authHeader());