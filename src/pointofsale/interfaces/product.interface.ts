import { Categories } from "./categories.interface";
import { Supplier } from "./supplier.interface";

export interface Product {
    id?: number;
    name: string;
    barCode?: string;
    description?: string;
    price: number;
    stock?: number; 
    category?: Categories; 
    suppliers?: Supplier[]; 
    costPrice: number; 
    discount?: number; 
    taxRate?: number;
    image?: string; 
  }

  export interface ProductRequest {
    id?: number;
    barCode?: string;
    name: string;
    description?: string;
    price: number;
    stock?: number; 
    category?: {id: number}; 
    suppliers?: [{id: number}]; 
    costPrice: number; 
    discount?: number; 
    taxRate?: number;
    image?: string; 
  }
  