import { Supplier } from "./supplier.interface";

export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    stock?: number; 
    category?: string; 
    suppliers?: Supplier[]; 
    costPrice: number; 
    discount?: number; 
    taxRate?: number;
    images?: string[]; 
  }
  