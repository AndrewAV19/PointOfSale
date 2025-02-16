import React, { useState } from "react";
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, Badge, Avatar, Box, Button } from "@mui/material";
import { ShoppingCart as ShoppingCartIcon, AccountCircle as AccountIcon, Notifications as NotificationsIcon } from "@mui/icons-material";
import { styled } from "@mui/system";

const Navbar = () => {
  // Estados para el menú desplegable
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationsMenu, setNotificationsMenu] = useState<null | HTMLElement>(null);

  // Abre y cierra el menú de usuario
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Abre y cierra el menú de notificaciones
  const handleNotificationsClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsMenu(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsMenu(null);
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#3f51b5" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo */}
        <Box display="flex" alignItems="center">
          <Avatar sx={{ width: 40, height: 40, marginRight: 2 }} src="/path/to/logo.png" alt="Logo" />
          <Typography variant="h6" component="div" sx={{ color: "white", fontWeight: "bold" }}>
            Punto de Venta
          </Typography>
        </Box>

        {/* Acciones en el lado derecho */}
        <Box display="flex" alignItems="center">
          {/* Carrito de Compras */}
          <IconButton color="inherit" onClick={handleNotificationsClick}>
            <Badge badgeContent={4} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          {/* Notificaciones */}
          <IconButton color="inherit" onClick={handleNotificationsClick}>
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Menú de Usuario */}
          <IconButton color="inherit" onClick={handleMenuClick}>
            <AccountIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                width: 200,
                maxWidth: "100%",
                boxShadow: 3,
                backgroundColor: "#fff",
                color: "#333",
              },
            }}
          >
            <MenuItem onClick={handleMenuClose}>Perfil</MenuItem>
            <MenuItem onClick={handleMenuClose}>Configuración</MenuItem>
            <MenuItem onClick={handleMenuClose}>Cerrar sesión</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
