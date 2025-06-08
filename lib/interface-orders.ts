export interface Order {
  _id?: string;
  customerName: string;
  date: Date;
  status: string;
  total: number;
  products: string[];
}
