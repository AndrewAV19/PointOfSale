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
import ProductTableReport from "../../tables/ProductTableReport";

const products = [
  { id: 1, name: "Producto A", sales: 150, revenue: 2250.0 },
  { id: 2, name: "Producto B", sales: 200, revenue: 3000.0 },
  { id: 3, name: "Producto C", sales: 120, revenue: 1800.0 },
  { id: 4, name: "Producto D", sales: 300, revenue: 4500.0 },
  { id: 5, name: "Producto E", sales: 200, revenue: 6500.0 },
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

const SalesReport: React.FC = () => {
  const pieChartData = products.map((product) => ({
    name: product.name,
    value: product.sales,
  }));

  return (
    <Card sx={cardStyles}>
      <CardContent>
        {/* Título del informe */}
        <Typography variant="h4" sx={titleStyles}>
          Informe de Ventas por Producto
        </Typography>

        {/* Contenido del informe */}
        <Box display="flex" flexDirection="column" gap={4}>
          {/* Tabla de productos */}
          <Box>
            <ProductTableReport products={products} />
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
                  {pieChartData.map((entry) => {
                    const product = products.find((p) => p.name === entry.name);
                    return (
                      <Cell
                        key={`cell-${product?.id}`}
                        fill={
                          COLORS[
                            products.findIndex((p) => p.name === entry.name) %
                              COLORS.length
                          ]
                        }
                        name={entry.name}
                      />
                    );
                  })}
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

export default SalesReport;
