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
  List as ListIcon,
} from "@mui/icons-material";

export const navigationMenu = [
  {
    id: "sales",
    text: "Ventas",
    icon: <StoreIcon />,
    subItems: [
      { text: "Crear Venta", path: "/", icon: <AddIcon /> },
      { text: "Historial de ventas", path: "/ventas/historial", icon: <HistoryIcon /> },
    ],
  },
  {
    id: "purchases",
    text: "Compras",
    icon: <ShoppingCartIcon />,
    subItems: [
      { text: "Crear Compra", path: "/compras", icon: <AddIcon /> },
      { text: "Historial de compras", path: "/compras/historial", icon: <HistoryIcon /> },
    ],
  },
  {
    id: "inventory",
    text: "Inventario",
    icon: <InventoryIcon />,
    subItems: [
      { text: "Agregar Producto", path: "/inventario/productos/agregar", icon: <AddIcon /> },
      { text: "Ver Productos", path: "/inventario/productos/historial", icon: <ListIcon /> },
      { text: "Crear Categoría", path: "/inventario/categorias/agregar", icon: <AddIcon /> }, 
      { text: "Ver Categorías", path: "/inventario/categorias/historial", icon: <ListIcon /> }, 
    ],
  },
  {
    id: "customers",
    text: "Clientes",
    icon: <PeopleIcon />,
    subItems: [
      { text: "Agregar Cliente", path: "/clientes/agregar", icon: <AddIcon /> },
      { text: "Historial de Clientes", path: "/clientes/historial", icon: <HistoryIcon /> },
      { text: "Pagos Pendientes", path: "/clientes/pagos-pendientes", icon: <CreditCardIcon /> },
    ],
  },
  {
    id: "suppliers",
    text: "Proveedores",
    icon: <LocalShippingIcon />,
    subItems: [
      { text: "Agregar Proveedor", path: "/proveedores/agregar", icon: <AddIcon /> },
      { text: "Historial de Proveedores", path: "/proveedores/historial", icon: <HistoryIcon /> },
    ],
  },
  {
    id: "users",
    text: "Usuarios",
    icon: <PeopleIcon />,
    subItems: [
      { text: "Crear Usuario", path: "/usuarios/agregar", icon: <AddIcon /> },
      { text: "Historial de Usuarios", path: "/usuarios/historial", icon: <HistoryIcon /> },
    ],
  },
  {
    id: "income",
    text: "Ingresos",
    icon: <AttachMoneyIcon />,
    subItems: [
      { text: "Ingresos del Día", path: "/ingresos/dia", icon: <BarChartIcon /> },
      { text: "Ingresos por Mes", path: "/ingresos/mes", icon: <BarChartIcon /> },
      { text: "Ingresos por Año", path: "/ingresos/anio", icon: <BarChartIcon /> },
    ],
  },
  {
    id: "expenses",
    text: "Egresos",
    icon: <CreditCardIcon />,
    subItems: [
      { text: "Egresos del Día", path: "/egresos/dia", icon: <BarChartIcon /> },
      { text: "Egresos por Mes", path: "/egresos/mes", icon: <BarChartIcon /> },
      { text: "Egresos por Año", path: "/egresos/anio", icon: <BarChartIcon /> },
    ],
  },  
  {
    id: "reports",
    text: "Informes",
    icon: <BarChartIcon />,
    subItems: [
      { text: "Ventas por Producto", path: "/informes/ventas-producto", icon: <ListIcon /> },
      { text: "Ventas por Categoría", path: "/informes/ventas-categoria", icon: <ListIcon /> },
      { text: "Balance General", path: "/informes/balance", icon: <BarChartIcon /> },
      { text: "Informe de Inventario", path: "/informes/inventario", icon: <ListIcon /> },
      { text: "Clientes Frecuentes", path: "/informes/clientes", icon: <PeopleIcon /> },
      { text: "Proveedores con Más Compras", path: "/informes/proveedores", icon: <LocalShippingIcon /> },
      { text: "Informe de Cancelaciones", path: "/informes/cancelaciones", icon: <HistoryIcon /> },
    ],
  },
  { id: "about", text: "Acerca de", icon: <PeopleIcon />, path: "/acerca-de" },
  { id: "settings", text: "Configuraciones", icon: <SettingsIcon />, path: "/configuraciones" },
  { id: "logout", text: "Cerrar sesión", icon: <ExitToAppIcon />, path: "/auth/login" },
];