import { StateCreator, create } from "zustand";
import { persist } from "zustand/middleware";
import { Clients } from "../pointofsale/interfaces/clients.interface";
import { ClientsService } from "../services/clients.service";

interface ClientsState {
  listClients: Clients[];
  loading: boolean;
  getClients: () => Promise<void>;

  createClient: (dataSend: {
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
  }) => Promise<Clients[]>;
}

const clientsStore: StateCreator<ClientsState> = (set) => ({
  listClients: [],
  loading: false,

  getClients: async () => {
    try {
      const data = await ClientsService.getClients();
      console.log(data);
      set({ listClients: data, loading: true });
    } catch (error) {
      set({ listClients: [], loading: false });
      throw new Error("Unauthorized");
    }
  },

  createClient: async (dataSend) => {
    try {
      set({ loading: true });
      const data = await ClientsService.createClient(dataSend);
      set({ listClients: data, loading: false });
      return data;
    } catch (error) {
      console.log(error);

      set({ loading: false });
      throw new Error("Error al crear la célula");
    }
  },
});

export const storeClients = create<ClientsState>()(
  persist(clientsStore, {
    name: "clients-data",
  })
);
