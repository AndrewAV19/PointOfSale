import api from "../lib/axios";
import { Users } from "../pointofsale/interfaces/users.interface";

export class UsersService {
  static readonly getUsers = async (): Promise<Users[]> => {
    try {
      const response = await api.get<[Users]>("/users", {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      console.log(response);
      return response.data;
    } catch (error) {
      throw new Error("UnAuthorized");
    }
  };

  static readonly getUserById = async (id: number): Promise<Users> => {
    try {
      const response = await api.get<Users>(
        `/users/${id}`,{
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
        });
      console.log(response);

      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Error al obtener el usuario");
    }
  };

  static readonly createUser = async (dataSend: {
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: number;
    country: string;
    roleIds: number[];  
  }): Promise<Users[]> => {
    try {
      const response = await api.post<Users[]>("/users", dataSend,{
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error("UnAuthorized");
    }
  };

  static readonly updateUser = async (
    id: number,
    dataSend: {
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
  ): Promise<Users> => {
    try {
      const response = await api.put<Users>(`/users/${id}`, dataSend, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error("Error al actualizar el usuario");
    }
  };

  static readonly deleteUser = async (id: number): Promise<void> => {
    try {
      await api.delete(`/users/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      console.log(`User with id ${id} deleted successfully`);
    } catch (error) {
      console.error(error);
      throw new Error("Error al eliminar el usuario");
    }
  };


}
