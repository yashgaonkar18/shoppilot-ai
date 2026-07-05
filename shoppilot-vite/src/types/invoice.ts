import { Sale } from "./sales";

export interface Invoice {
  _id: string;

  invoice_number: string;

 sale: Sale;

  total: number;

  created_at: string;

  pdf_url?: string;
}