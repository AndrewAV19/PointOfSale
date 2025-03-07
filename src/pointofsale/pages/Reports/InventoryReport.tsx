import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import InventoryTableReport from "../../tables/InventoryTableReport";

const inventoryData = [
  {
    id: 1,
    name: "Producto A",
    category: "Electrónica",
    stock: 5,
    status: "Poco Stock",
  },
  { id: 2, name: "Producto B", category: "Hogar", stock: 0, status: "Agotado" },
  {
    id: 3,
    name: "Producto C",
    category: "Electrónica",
    stock: 20,
    status: "Disponible",
  },
  {
    id: 4,
    name: "Producto D",
    category: "Ropa",
    stock: 2,
    status: "Poco Stock",
  },
  { id: 5, name: "Producto E", category: "Hogar", stock: 0, status: "Agotado" },
];

const COLORS = ["#FF6384", "#FFCE56"];

const cardStyles = {
  borderRadius: "12px",
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#ffffff",
};

const titleStyles = {
  fontSize: "1.5rem",
  fontWeight: "600",
  color: "#333333",
  marginBottom: "24px",
};

const chartContainerStyles = {
  width: "100%",
  height: "300px",
  marginTop: "24px",
};

const InventoryReport: React.FC = () => {
  const filteredInventoryData = inventoryData.filter(
    (item) => item.status === "Poco Stock" || item.status === "Agotado"
  );

  const pieChartData = [
    {
      name: "Poco Stock",
      value: filteredInventoryData.filter(
        (item) => item.status === "Poco Stock"
      ).length,
    },
    {
      name: "Agotado",
      value: filteredInventoryData.filter((item) => item.status === "Agotado")
        .length,
    },
  ];

  return (
    <Card sx={cardStyles}>
      <CardContent>
        {/* Título del informe */}
        <Typography variant="h4" sx={titleStyles}>
          Informe de Inventario (Poco Stock y Agotados)
        </Typography>

        {/* Contenido del informe */}
        <Box display="flex" flexDirection="column" gap={4}>
          {/* Tabla de inventario */}
          <Box>
            <InventoryTableReport inventoryData={filteredInventoryData} />
          </Box>

          {/* Gráfica de pastel */}
          <Box sx={chartContainerStyles}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {pieChartData.map((entry) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={
                        COLORS[
                          pieChartData.findIndex((e) => e.name === entry.name) %
                            COLORS.length
                        ]
                      }
                      name={entry.name}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: "16px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default InventoryReport;
