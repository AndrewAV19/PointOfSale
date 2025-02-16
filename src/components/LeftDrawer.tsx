import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  styled,
  Typography,
} from "@mui/material";
import {
  Home as HomeIcon,
  Store as StoreIcon,
  Inventory as InventoryIcon,
  People as PeopleIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  AttachMoney as AttachMoneyIcon, 
  ShoppingCart as ShoppingCartIcon, 
  CreditCard as CreditCardIcon, 
  LocalShipping as LocalShippingIcon, 
} from "@mui/icons-material";

const StyledDrawer = styled(Drawer)({
  width: 240,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: 240,
    boxSizing: "border-box",
    position: "relative",
    backgroundColor: "#2C3E50", 
    color: "#ECF0F1", 
    paddingTop: 24,
    borderRight: "2px solid #34495E", 
  },
});

const StyledListItemButton = styled(ListItemButton)({
  padding: "8px 16px",
  "&:hover": {
    backgroundColor: "#34495E", 
    transition: "background-color 0.3s", 
  },
});

const StyledListItemText = styled(ListItemText)({
  color: "#ECF0F1",
  fontWeight: "500", 
});

const StyledListItemIcon = styled(ListItemIcon)({
  color: "#ECF0F1", 
});

const LogoContainer = styled("div")({
  marginBottom: 20,
  padding: "0 16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center", 
  gap: "10px", 
});

const menuItems = [
  { id: "home", text: "Inicio", icon: <HomeIcon /> },
  { id: "sales", text: "Ventas", icon: <StoreIcon /> },
  { id: "purchases", text: "Compras", icon: <ShoppingCartIcon /> }, 
  { id: "inventory", text: "Inventario", icon: <InventoryIcon /> },
  { id: "customers", text: "Clientes", icon: <PeopleIcon /> },
  { id: "suppliers", text: "Proveedores", icon: <LocalShippingIcon /> }, 
  { id: "income", text: "Ingresos", icon: <AttachMoneyIcon /> }, 
  { id: "expenses", text: "Egresos", icon: <CreditCardIcon /> }, 
  { id: "reports", text: "Informes", icon: <BarChartIcon /> },
  { id: "settings", text: "Configuraciones", icon: <SettingsIcon /> },
];

const LeftSidebar: React.FC = () => {
  return (
    <StyledDrawer variant="permanent" anchor="left">
      {/* Logo y título */}
      <LogoContainer>
        <Avatar alt="Logo" sx={{ width: 60, height: 60 }} />
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Punto de Venta
        </Typography>
      </LogoContainer>

      <Divider sx={{ borderColor: "#34495E" }} />

      {/* Menú de navegación */}
      <List>
        {menuItems.map((item) => (
          <StyledListItemButton key={item.id}>
            <StyledListItemIcon>{item.icon}</StyledListItemIcon>
            <StyledListItemText primary={item.text} />
          </StyledListItemButton>
        ))}
      </List>
    </StyledDrawer>
  );
};

export default LeftSidebar;
