export interface SaleItem {
  product_id: string | null;
  product_name: string;
  qty: number;
  unit_price: number;
  line_total: number;
}

export interface Sale {
  _id: string;

  customer_name: string | null;

  customer_phone: string | null;

  total: number;

  sold_at: string;

  sale_items: SaleItem[];

  createdAt?: string;

  updatedAt?: string;
}