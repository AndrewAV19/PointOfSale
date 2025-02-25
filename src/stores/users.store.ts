import { StateCreator, create } from "zustand";
import { persist } from "zustand/middleware";
import { Users} from "../pointofsale/interfaces/users.interface";
import { UsersService } from "../services/users.service";

interface UsersState {
  listUsers: Users[];
  loading: boolean;
  getUsers: () => Promise<void>;

  createUser: (dataSend: {
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
  }) => Promise<Users[]>;
}

const usersStore: StateCreator<UsersState> = (set) => ({
  listUsers: [],
  loading: false,

  getUsers: async () => {
    try {
      const data = await UsersService.getUsers();
      console.log(data);
      set({ listUsers: data, loading: true });
    } catch (error) {
      set({ listUsers: [], loading: false });
      throw new Error("Unauthorized");
    }
  },

  createUser: async (dataSend) => {
    try {
      set({ loading: true });
      const data = await UsersService.createUser(dataSend);
      set({ listUsers: data, loading: false });
      return data;
    } catch (error) {
      console.log(error);

      set({ loading: false });
      throw new Error("Error al crear el usuario");
    }
  },
});

export const storeUsers = create<UsersState>()(
  persist(usersStore, {
    name: "users-data",
  })
);
