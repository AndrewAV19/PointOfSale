import React from "react";
import { Box } from "@mui/material";
import LeftSidebar from "../../components/LeftDrawer";
import CreateSalePage from "./Sales/CreateSalePage";


const PointOfSale: React.FC = () => {
 
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
    
      {/* Contenedor principal con el menú lateral fijo */}
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        {/* Menú a la izquierda */}
        <LeftSidebar />

        {/* Contenido principal */}
        <Box sx={{ flexGrow: 1, padding: 3 }}>
         <CreateSalePage/>
               
        </Box>
      </Box>
    </Box>
  );
};

export default PointOfSale;
