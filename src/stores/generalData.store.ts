import { StateCreator, create } from "zustand";
import { persist } from "zustand/middleware";
import { Users } from "../pointofsale/interfaces/users.interface";
import { UsersService } from "../services/users.service";

interface DataState {
  selectedUser: Users | null;
  setSelectedUser: (user: Users) => void;
  statusRefresh: boolean;
  getUserById: (idUser: number) => Promise<void>;
}


const storeData: StateCreator<DataState> = (set) => ({
  selectedUser: null,
  setSelectedUser: (user: Users) => set(() => ({ selectedUser: user })),
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


});

export const dataStore = create<DataState>()(
  persist(storeData, {
    name: "general-data",
  })
);
