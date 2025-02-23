import api from "../lib/axios";
import { Clients } from "../pointofsale/interfaces/clients.interface";

export class ClientsService {
  static readonly getClients = async (): Promise<Clients[]> => {
    try {
      const response = await api.get<Clients[]>("/clients");
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

  static readonly createClient = async (dataSend: {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    createdAt: Date;
    updatedAt: Date;
  }): Promise<Clients[]> => {
    try {
      const response = await api.post<Clients[]>("/clients", dataSend);
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
