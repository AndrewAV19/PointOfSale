import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  Avatar,
  styled,
  Typography,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { menuItems } from "./MenuConfig";

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

const LeftSidebar: React.FC = () => {
  const navigate = useNavigate();
  // Guardamos solo el ID del submenú abierto, o null si ninguno está abierto
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const handleToggleSubmenu = (id: string) => {
    // Si el submenú actual está abierto, lo cerramos, si no, lo abrimos y cerramos otros
    setOpenSubmenu(prev => (prev === id ? null : id));
  };

  return (
    <StyledDrawer variant="permanent" anchor="left">
      {/* Logo y título */}
      <LogoContainer>
        <Avatar alt="Logo" sx={{ width: 60, height: 60 }} />
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Mi Tiendita
        </Typography>
      </LogoContainer>

      <Divider sx={{ borderColor: "#34495E" }} />

      {/* Menú de navegación */}
      <List>
        {menuItems.map((item) => (
          <React.Fragment key={item.id}>
            {item.subItems ? (
              <>
                <StyledListItemButton onClick={() => handleToggleSubmenu(item.id)}>
                  <StyledListItemIcon>{item.icon}</StyledListItemIcon>
                  <StyledListItemText primary={item.text} />
                  {openSubmenu === item.id ? <ExpandLess /> : <ExpandMore />}
                </StyledListItemButton>
                <Collapse in={openSubmenu === item.id} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem) => (
                      <StyledListItemButton key={subItem.text} sx={{ pl: 4 }} onClick={() => navigate(subItem.path)}>
                        <StyledListItemIcon>{subItem.icon}</StyledListItemIcon>
                        <StyledListItemText primary={subItem.text} />
                      </StyledListItemButton>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              <StyledListItemButton onClick={() => navigate(item.path || "/")}>
                <StyledListItemIcon>{item.icon}</StyledListItemIcon>
                <StyledListItemText primary={item.text} />
              </StyledListItemButton>
            )}
          </React.Fragment>
        ))}
      </List>
    </StyledDrawer>
  );
};

export default LeftSidebar;
