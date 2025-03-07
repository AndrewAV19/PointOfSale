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
import FrequentSuppliersTableReport from "../../tables/FrequentSuppliersTableReport";

const frequentSuppliersData = [
  { id: 1, name: "Proveedor A", deliveries: 25, totalTransactions: 5000.0 },
  { id: 2, name: "Proveedor B", deliveries: 18, totalTransactions: 3600.0 },
  { id: 3, name: "Proveedor C", deliveries: 12, totalTransactions: 2400.0 },
  { id: 4, name: "Proveedor D", deliveries: 8, totalTransactions: 1600.0 },
  { id: 5, name: "Proveedor E", deliveries: 5, totalTransactions: 1000.0 },
];

const COLORS = ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0", "#4da4C0"];

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

const FrequentSuppliersReport: React.FC = () => {
  const pieChartData = frequentSuppliersData.map((supplier) => ({
    name: supplier.name,
    value: supplier.deliveries,
  }));

  return (
    <Card sx={cardStyles}>
      <CardContent>
        {/* Título del informe */}
        <Typography variant="h4" sx={titleStyles}>
          Informe de Proveedores Frecuentes
        </Typography>

        {/* Contenido del informe */}
        <Box display="flex" flexDirection="column" gap={4}>
          {/* Tabla de proveedores frecuentes */}
          <Box>
            <FrequentSuppliersTableReport suppliers={frequentSuppliersData} />
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

export default FrequentSuppliersReport;
