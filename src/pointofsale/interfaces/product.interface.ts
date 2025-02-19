export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    stock?: number; 
    category?: string; 
    supplier?: string; // Proveedor
    costPrice?: number; // Precio de costo
    discount?: number; // Descuento aplicable
    taxRate?: number; // Impuesto aplicable
    images?: string[]; // URLs de imágenes del producto
    createdAt?: Date; // Fecha de creación
    updatedAt?: Date; // Fecha de última actualización
  }
  