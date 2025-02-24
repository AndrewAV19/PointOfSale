export interface Supplier {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: number;
    country?: string;
    taxId?: string; // Número de identificación fiscal
    website?: string;
  }
  
  export interface SupplierProduct {
    productId: number;
    productName: string;
    costPrice: number; 
    stockSupplied: number;
  }
  