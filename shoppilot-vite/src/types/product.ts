export type Product = {
  _id: string;

  name: string;

  category: string | null;

  qty: number;

  unit: string;

  buy_price: number;

  sell_price: number;

  low_stock_threshold: number;

  createdAt?: string;
  updatedAt?: string;
};