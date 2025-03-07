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
import BalanceTableReport from "../../tables/BalanceTableReport";

const balanceData = [
  {
    id: 1,
    type: "Venta",
    amount: 10000.0,
    client: "Cliente A",
    date: "2023-10-01",
  },
  {
    id: 2,
    type: "Venta",
    amount: 5000.0,
    client: "Cliente B",
    date: "2023-10-02",
  },
  {
    id: 3,
    type: "Compra",
    amount: 4000.0,
    client: "Proveedor X",
    date: "2023-10-03",
  },
  {
    id: 4,
    type: "Compra",
    amount: 2000.0,
    client: "Proveedor Y",
    date: "2023-10-04",
  },
  {
    id: 5,
    type: "Compra",
    amount: 1000.0,
    client: "Proveedor Z",
    date: "2023-10-05",
  },
];

const COLORS = ["#36A2EB", "#FF6384"];

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

const BalanceReport: React.FC = () => {
  const pieChartData = [
    {
      name: "Ingresos",
      value: balanceData
        .filter((item) => item.type === "Venta")
        .reduce((sum, item) => sum + item.amount, 0),
    },
    {
      name: "Egresos",
      value: balanceData
        .filter((item) => item.type === "Compra")
        .reduce((sum, item) => sum + item.amount, 0),
    },
  ];

  return (
    <Card sx={cardStyles}>
      <CardContent>
        {/* Título del informe */}
        <Typography variant="h4" sx={titleStyles}>
          Balance General (Ingresos y Egresos)
        </Typography>

        {/* Contenido del informe */}
        <Box display="flex" flexDirection="column" gap={4}>
          {/* Tabla de ventas y compras */}
          <Box>
            <BalanceTableReport balanceData={balanceData} />
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

export default BalanceReport;
