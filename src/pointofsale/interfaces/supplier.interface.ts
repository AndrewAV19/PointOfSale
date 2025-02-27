export interface Supplier {
    id?: number;
    name: string;
    contactName?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: number;
    country?: string;
    taxId?: string; 
    website?: string;
  }
  
  export interface SupplierProduct {
    productId: number;
    productName: string;
    costPrice: number; 
    stockSupplied: number;
  }
  