export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    stock?: number; 
    category?: string; 
    supplier?: string; 
    costPrice: number; 
    discount?: number; 
    taxRate?: number;
    images?: string[]; 
    createdAt?: Date;
    updatedAt?: Date; 
  }
  