export interface Users {
    id: number;
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: number;
    country?: string;
    rol: string;
    admin?: boolean;
  }
  