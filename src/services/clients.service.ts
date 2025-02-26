import api from "../lib/axios";
import { Clients } from "../pointofsale/interfaces/clients.interface";

export class ClientsService {

  static readonly getClients = async (): Promise<Clients[]> => {
    try {
      const response = await api.get<Clients[]>("/clients", {
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
      const response = await api.post<Clients[]>("/clients", dataSend,{
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

  static readonly deleteClient = async (id: number): Promise<void> => {
    try {
      await api.delete(`/clients/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log(`Client with id ${id} deleted successfully`);
    } catch (error) {
      console.error(error);
      throw new Error("Error al eliminar el cliente");
    }
  };

}
