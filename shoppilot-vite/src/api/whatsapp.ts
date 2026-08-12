import api from "./axios";

export const getWhatsAppLink = (invoiceId: string) =>
  api.get(`/whatsapp/invoice/${invoiceId}`);