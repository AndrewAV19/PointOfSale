import { StateCreator, create } from "zustand";
import { persist } from "zustand/middleware";
import { Users } from "../pointofsale/interfaces/users.interface";
import { UsersService } from "../services/users.service";
import { Clients } from "../pointofsale/interfaces/clients.interface";
import { ClientsService } from "../services/clients.service";
import { Supplier } from "../pointofsale/interfaces/supplier.interface";
import { SuppliersService } from "../services/suppliers.service";

interface DataState {
  selectedUser: Users | null;
  setSelectedUser: (user: Users) => void;
  selectedClient: Clients | null;
  setSelectedClient: (client: Clients) => void;
  selectedSupplier: Supplier | null;
  setSelectedSupplier: (supplier: Supplier) => void;
  statusRefresh: boolean;
  getUserById: (idUser: number) => Promise<void>;
  getClientById: (idClient: number) => Promise<void>;
  getSupplierById: (idSupplier: number) => Promise<void>;
}


const storeData: StateCreator<DataState> = (set) => ({
  selectedUser: null,
  setSelectedUser: (user: Users) => set(() => ({ selectedUser: user })),
  selectedClient: null,
  setSelectedClient: (client: Clients) => set(() => ({ selectedClient: client })),
  selectedSupplier: null,
  setSelectedSupplier: (supplier: Supplier) => set(() => ({ selectedSupplier: supplier })),
  statusRefresh: false,
 
  getUserById: async (idUser: number) => {
    try {
      set(() => ({ statusRefresh: true }));
      const user = await UsersService.getUserById(idUser);
      set(() => ({ selectedUser: user, statusRefresh: false }));
    } catch (error) {
      console.error(error);
      set(() => ({ statusRefresh: false }));
    }
  },

  getClientById: async (idClient: number) => {
    try {
      set(() => ({ statusRefresh: true }));
      const client = await ClientsService.getClientById(idClient);
      set(() => ({ selectedClient: client, statusRefresh: false }));
    } catch (error) {
      console.error(error);
      set(() => ({ statusRefresh: false }));
    }
  },

  getSupplierById: async (idSupplier: number) => {
    try {
      set(() => ({ statusRefresh: true }));
      const supplier = await SuppliersService.getSupplierById(idSupplier);
      set(() => ({ selectedSupplier: supplier, statusRefresh: false }));
    } catch (error) {
      console.error(error);
      set(() => ({ statusRefresh: false }));
    }
  },


});

export const dataStore = create<DataState>()(
  persist(storeData, {
    name: "general-data",
  })
);
