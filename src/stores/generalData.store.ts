import { StateCreator, create } from "zustand";
import { persist } from "zustand/middleware";
import { Users } from "../pointofsale/interfaces/users.interface";
import { UsersService } from "../services/users.service";
import { Clients } from "../pointofsale/interfaces/clients.interface";
import { ClientsService } from "../services/clients.service";
import { Supplier } from "../pointofsale/interfaces/supplier.interface";
import { SuppliersService } from "../services/suppliers.service";
import { Categories } from "../pointofsale/interfaces/categories.interface";
import { CategoriesService } from "../services/categories.service";
import { Product } from "../pointofsale/interfaces/product.interface";
import { ProductService } from "../services/products.service";
import { Sale } from "../pointofsale/interfaces/sales.interface";
import { SaleService } from "../services/sales.service";

interface DataState {
  selectedUser: Users | null;
  setSelectedUser: (user: Users) => void;
  selectedClient: Clients | null;
  setSelectedClient: (client: Clients) => void;
  selectedSupplier: Supplier | null;
  setSelectedSupplier: (supplier: Supplier) => void;
  selectedCategory: Categories | null;
  setSelectedCategory: (category: Categories) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product) => void;
  selectedSale: Sale | null;
  setSelectedSale: (sale: Sale) => void;
  statusRefresh: boolean;
  getUserById: (idUser: number) => Promise<void>;
  getClientById: (idClient: number) => Promise<void>;
  getSupplierById: (idSupplier: number) => Promise<void>;
  getCategoryById: (idCategory: number) => Promise<void>;
  getProductById: (idProduct: number) => Promise<void>;
  getSaleById: (idProduct: number) => Promise<void>;
}


const storeData: StateCreator<DataState> = (set) => ({
  selectedUser: null,
  setSelectedUser: (user: Users) => set(() => ({ selectedUser: user })),
  selectedClient: null,
  setSelectedClient: (client: Clients) => set(() => ({ selectedClient: client })),
  selectedSupplier: null,
  setSelectedSupplier: (supplier: Supplier) => set(() => ({ selectedSupplier: supplier })),
  selectedCategory: null,
  setSelectedCategory: (category: Categories) => set(() => ({ selectedCategory: category })),
  selectedProduct: null,
  setSelectedProduct: (product: Product) => set(() => ({ selectedProduct: product })),
  selectedSale: null,
  setSelectedSale: (sale: Sale) => set(() => ({ selectedSale: sale })),
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

  getCategoryById: async (idCategory: number) => {
    try {
      set(() => ({ statusRefresh: true }));
      const category = await CategoriesService.getCategoryById(idCategory);
      set(() => ({ selectedCategory: category, statusRefresh: false }));
    } catch (error) {
      console.error(error);
      set(() => ({ statusRefresh: false }));
    }
  },

  getProductById: async (idProduct: number) => {
    try {
      set(() => ({ statusRefresh: true }));
      const product = await ProductService.getProductById(idProduct);
      set(() => ({ selectedProduct: product, statusRefresh: false }));
    } catch (error) {
      console.error(error);
      set(() => ({ statusRefresh: false }));
    }
  },

  getSaleById: async (idSale: number) => {
    try {
      set(() => ({ statusRefresh: true }));
      const sale = await SaleService.getSaleById(idSale);
      set(() => ({ selectedSale: sale, statusRefresh: false }));
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
