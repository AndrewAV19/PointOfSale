import { Clients } from "./clients.interface";
import { Product } from "./product.interface";

export interface Sale {
    id?: number;
    client?: Clients;
    saleProducts: SaleProduct[];
    amount: number;
    state: string;
    total: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface SaleProduct {
    id?: number;
    product: Product;
    quantity: number;
}

export interface SaleRequest {
    client?: { id: number };
    saleProducts: SaleProductRequest[];
    amount?: number;
    state?: string;
    total?: number;
}

export interface SaleProductRequest {
    product: { id: number };
    quantity: number;
}