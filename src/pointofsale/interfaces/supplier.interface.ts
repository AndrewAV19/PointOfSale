export interface Supplier {
    id: number;
    name: string;
    contactName?: string; // Nombre de la persona de contacto
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    taxId?: string; // Número de identificación fiscal
    website?: string;
    createdAt: Date; // Fecha de registro del proveedor
    updatedAt?: Date; // Última actualización de datos
    productsSupplied?: SupplierProduct[]; // Productos suministrados
  }
  
  export interface SupplierProduct {
    productId: number;
    productName: string;
    costPrice: number; 
    stockSupplied: number;
  }
  