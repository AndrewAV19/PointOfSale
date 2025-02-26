export interface Role {
  id: number;
  name: string;
}

export interface Users {
  id: number;
  name: string;
  email: string;
  password?: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: number;
  country: string;
  roles: Role[];
  enabled: boolean;
}

export interface UserRequest {
  name: string;
  email: string;
  password?: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: number;
  country: string;
  roleIds: number[];  
}
