import React from "react";
import { Box } from "@mui/material";
import LeftSidebar from "../../components/LeftDrawer";
import { Outlet } from "react-router-dom";

const PointOfSale: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh", 
      }}
    >
      {/* Menú a la izquierda */}
      <LeftSidebar />

      {/* Contenido principal */}
      <Box
        sx={{
          flexGrow: 1,
          padding: 3,
          height: "100vh", 
          overflowY: "auto",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default PointOfSale;
