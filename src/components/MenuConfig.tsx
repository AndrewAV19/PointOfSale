import {
  Store as StoreIcon,
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
  People as PeopleIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  AttachMoney as AttachMoneyIcon,
  CreditCard as CreditCardIcon,
  LocalShipping as LocalShippingIcon,
  ExitToApp as ExitToAppIcon,
  Add as AddIcon,
  History as HistoryIcon,
} from "@mui/icons-material";

export const menuItems = [
  {
    id: "sales",
    text: "Ventas",
    icon: <StoreIcon />,
    subItems: [
      { text: "Crear Venta", path: "/", icon: <AddIcon /> },
      { text: "Historial", path: "/ventas/historial", icon: <HistoryIcon /> },
    ],
  },
  {
    id: "purchases",
    text: "Compras",
    icon: <ShoppingCartIcon />,
    subItems: [
      { text: "Crear Compra", path: "/compras", icon: <AddIcon /> },
      { text: "Historial", path: "/compras/historial", icon: <HistoryIcon /> },
    ],
  },
  { id: "inventory", text: "Inventario", icon: <InventoryIcon />, path: "/inventario" },
  { id: "customers", text: "Clientes", icon: <PeopleIcon />, path: "/clientes" },
  { id: "suppliers", text: "Proveedores", icon: <LocalShippingIcon />, path: "/proveedores" },
  { id: "income", text: "Ingresos", icon: <AttachMoneyIcon />, path: "/ingresos" },
  { id: "expenses", text: "Egresos", icon: <CreditCardIcon />, path: "/egresos" },
  { id: "reports", text: "Informes", icon: <BarChartIcon />, path: "/informes" },
  { id: "about",text: "Acerca de", icon: <PeopleIcon />, path: "/acerca-de", },
  { id: "settings", text: "Configuraciones", icon: <SettingsIcon />, path: "/configuraciones" },
  { id: "logout", text: "Cerrar sesión", icon: <ExitToAppIcon />, path: "/auth/login" },
];
