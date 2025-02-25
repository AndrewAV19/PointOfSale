import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  styled,
  Typography,
} from "@mui/material";
import { ExpandLess, ExpandMore, Storefront as StorefrontIcon } from "@mui/icons-material";
import { navigationMenu } from "./NavigationMenu";
import useLogout from "../hooks/useLogout";


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
  marginBottom: 10,
  paddingLeft: "10px ",
  display: "flex",
  alignItems: "center",
  justifyContent: "left",
  gap: "10px",
});

const SideMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const handleLogout = useLogout();

  useEffect(() => {
    // Detectar si la ruta pertenece a un subItem
    const currentItem = navigationMenu.find(
      (item) =>
        item.subItems?.some((subItem) => subItem.path === location.pathname) ||
        item.path === location.pathname
    );

    if (currentItem?.subItems) {
      setOpenSubmenu(currentItem.id);
    } else {
      setOpenSubmenu(null);
    }

    setActiveItem(currentItem?.id ?? null);
  }, [location.pathname]);

  const handleToggleSubmenu = (id: string) => {
    setOpenSubmenu((prev) => (prev === id ? null : id));
    setActiveItem(id);
  };

  const handleClickItemWithoutSubmenu = (path: string, id: string) => {
    if (id === "logout") {
      handleLogout(); 
    } else {
      navigate(path);
    }
    setOpenSubmenu(null);
    setActiveItem(id);
  };

  return (
    <StyledDrawer variant="permanent" anchor="left">
      <LogoContainer>
      <StorefrontIcon sx={{ fontSize: 60, color: "#ECF0F1" }} />
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Mi Tiendita
        </Typography>
      </LogoContainer>

      <Divider sx={{ borderColor: "#34495E" }} />

      <List>
        {navigationMenu.map((item) => (
          <React.Fragment key={item.id}>
            {item.subItems ? (
              <>
                <StyledListItemButton
                  onClick={() => handleToggleSubmenu(item.id)}
                >
                  <StyledListItemIcon
                    sx={{
                      color: openSubmenu === item.id ? "#1ABC9C" : "#ECF0F1",
                    }}
                  >
                    {item.icon}
                  </StyledListItemIcon>
                  <StyledListItemText
                    primary={item.text}
                    sx={{
                      color: openSubmenu === item.id ? "#1ABC9C" : "#ECF0F1",
                    }}
                  />
                  {openSubmenu === item.id ? <ExpandLess /> : <ExpandMore />}
                </StyledListItemButton>
                <Collapse
                  in={openSubmenu === item.id}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem) => (
                      <StyledListItemButton
                        key={subItem.text}
                        sx={{
                          pl: 4,
                          backgroundColor:
                            location.pathname === subItem.path
                              ? "#16A085"
                              : "inherit",
                          "&:hover": {
                            backgroundColor:
                              location.pathname === subItem.path
                                ? "#16A085"
                                : "rgba(0, 0, 0, 0.08)",
                          },
                        }}
                        onClick={() => navigate(subItem.path)}
                      >
                        <StyledListItemIcon>{subItem.icon}</StyledListItemIcon>
                        <StyledListItemText primary={subItem.text} />
                      </StyledListItemButton>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              <StyledListItemButton
                sx={{
                  backgroundColor:
                    activeItem === item.id ? "inherit" : "transparent",
                  "&:hover": { backgroundColor: "transparent" },
                }}
                onClick={() =>
                  handleClickItemWithoutSubmenu(item.path, item.id)
                }
              >
                <StyledListItemIcon
                  sx={{ color: activeItem === item.id ? "#1ABC9C" : "#ECF0F1" }}
                >
                  {item.icon}
                </StyledListItemIcon>
                <StyledListItemText
                  primary={item.text}
                  sx={{ color: activeItem === item.id ? "#1ABC9C" : "#ECF0F1" }}
                />
              </StyledListItemButton>
            )}
          </React.Fragment>
        ))}
      </List>
    </StyledDrawer>
  );
};

export default SideMenu;
