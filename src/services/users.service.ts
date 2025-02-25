import api from "../lib/axios";
import { Users } from "../pointofsale/interfaces/users.interface";

export class UsersService {
  static readonly getUsers = async (): Promise<Users[]> => {
    try {
      const response = await api.get<[Users]>("/users");
      console.log(response);
      return response.data;
    } catch (error) {
      throw new Error("UnAuthorized");
    }
  };

  // static readonly getCellById = async (id: number): Promise<Cell> => {
  //   try {
  //     const response = await api.get<Cell>(
  //       `/evaluaciti/api/celulas/${id}`
  //     );
  //     console.log(response);

  //     return response.data.data;
  //   } catch (error) {
  //     console.error(error);
  //     throw new Error("Error al obtener la célula");
  //   }
  // };

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
      const response = await api.post<Users[]>("/users", dataSend);
      
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error("UnAuthorized");
    }
  };

  // static readonly deleteCell = async (id: number): Promise<Cell[]> => {
  //   try {
  //     const { data } = await backOfficeApi.delete<Cell[]>(
  //       `/api-backoffice-Cells/Cells/delete-by-id/${id}`
  //     );
  //     return data;
  //   } catch (error) {
  //     throw new Error("UnAuthorized");
  //   }
  // };
}
