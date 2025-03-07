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
import CanceledSalesTableReport from "../../tables/CanceledSalesTableReport";

const canceledSalesData = [
  {
    id: 1,
    orderId: "ORD001",
    amount: 500.0,
    customer: "Cliente A",
    date: "2023-10-01",
  },
  {
    id: 2,
    orderId: "ORD002",
    amount: 300.0,
    customer: "Cliente B",
    date: "2023-10-02",
  },
  {
    id: 3,
    orderId: "ORD003",
    amount: 200.0,
    customer: "Cliente C",
    date: "2023-10-03",
  },
  {
    id: 4,
    orderId: "ORD004",
    amount: 450.0,
    customer: "Cliente D",
    date: "2023-10-04",
  },
  {
    id: 5,
    orderId: "ORD005",
    amount: 150.0,
    customer: "Cliente E",
    date: "2023-10-05",
  },
];

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#4da4C0"];

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

const CanceledSalesReport: React.FC = () => {
  const pieChartData = canceledSalesData.map((sale) => ({
    name: sale.orderId,
    value: sale.amount,
  }));

  return (
    <Card sx={cardStyles}>
      <CardContent>
        {/* Título del informe */}
        <Typography variant="h4" sx={titleStyles}>
          Informe de Ventas Canceladas
        </Typography>

        {/* Contenido del informe */}
        <Box display="flex" flexDirection="column" gap={4}>
          {/* Tabla de ventas canceladas */}
          <Box>
            <CanceledSalesTableReport sales={canceledSalesData} />
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

export default CanceledSalesReport;
