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
import FrequentCustomersTableReport from "../../tables/FrequentCustomersTableReport";

const frequentCustomersData = [
  { id: 1, name: "Cliente A", purchases: 15, totalSpent: 2250.0 },
  { id: 2, name: "Cliente B", purchases: 10, totalSpent: 1500.0 },
  { id: 3, name: "Cliente C", purchases: 8, totalSpent: 1200.0 },
  { id: 4, name: "Cliente D", purchases: 5, totalSpent: 750.0 },
  { id: 5, name: "Cliente E", purchases: 3, totalSpent: 450.0 },
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

const FrequentCustomersReport: React.FC = () => {
  const pieChartData = frequentCustomersData.map((customer) => ({
    name: customer.name,
    value: customer.purchases,
  }));

  return (
    <Card sx={cardStyles}>
      <CardContent>
        {/* Título del informe */}
        <Typography variant="h4" sx={titleStyles}>
          Informe de Clientes Frecuentes
        </Typography>

        {/* Contenido del informe */}
        <Box display="flex" flexDirection="column" gap={4}>
          {/* Tabla de clientes frecuentes */}
          <Box>
            <FrequentCustomersTableReport customers={frequentCustomersData} />
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

export default FrequentCustomersReport;
