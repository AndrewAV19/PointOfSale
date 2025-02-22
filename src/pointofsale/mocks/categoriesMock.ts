
import { Categories } from "../interfaces/categories.interface";

export const categories: Categories[] = [
  {
    id: 1,
    name: "Lácteos",
    description: "Productos derivados de la leche como leche, queso, yogurt, entre otros.",
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2023-07-05"),
  },
  {
    id: 2,
    name: "Panadería",
    description: "Productos de panadería como pan, bollos, galletas, etc.",
    createdAt: new Date("2022-05-15"),
    updatedAt: new Date("2023-06-20"),
  },
  {
    id: 3,
    name: "Carnes",
    description: "Productos de carne como res, pollo, cerdo y embutidos.",
    createdAt: new Date("2020-10-10"),
    updatedAt: new Date("2023-07-01"),
  },
  {
    id: 4,
    name: "Verduras",
    description: "Verduras frescas como lechuga, jitomate, zanahorias, etc.",
    createdAt: new Date("2021-08-20"),
    updatedAt: new Date("2023-05-30"),
  },
  {
    id: 5,
    name: "Frutas",
    description: "Frutas frescas como manzanas, plátanos, naranjas, entre otras.",
    createdAt: new Date("2021-02-15"),
    updatedAt: new Date("2023-06-25"),
  },
  {
    id: 6,
    name: "Bebidas",
    description: "Jugos, refrescos, aguas frescas, entre otros.",
    createdAt: new Date("2020-06-10"),
    updatedAt: new Date("2023-07-15"),
  },
  {
    id: 7,
    name: "Congelados",
    description: "Productos congelados como verduras congeladas, pizzas, helados, etc.",
    createdAt: new Date("2018-09-25"),
    updatedAt: new Date("2023-05-05"),
  },
  {
    id: 8,
    name: "Cereales",
    description: "Cereales y productos para el desayuno.",
    createdAt: new Date("2017-12-10"),
    updatedAt: new Date("2023-06-10"),
  },
  {
    id: 9,
    name: "Productos de limpieza",
    description: "Productos para limpieza del hogar como detergentes, desinfectantes, etc.",
    createdAt: new Date("2022-03-05"),
    updatedAt: new Date("2023-07-01"),
  },
  {
    id: 10,
    name: "Snacks",
    description: "Botanas y productos para picar como papas fritas, galletas, chocolates.",
    createdAt: new Date("2019-11-20"),
    updatedAt: new Date("2023-06-15"),
  }
];
