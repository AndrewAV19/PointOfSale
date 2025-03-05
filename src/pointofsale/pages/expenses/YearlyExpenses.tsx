import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import {
  MoneyOff,
  TrendingDown,
  Receipt,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useExpenseStore } from "../../../stores/expenses.store";

const YearlyExpense: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { yearlyExpense, getYearlyExpense } = useExpenseStore();

  useEffect(() => {
    getYearlyExpense(selectedYear);
  }, [selectedYear, getYearlyExpense]);

  let data = yearlyExpense;

  // Función para obtener el nombre abreviado del mes
  const getMonthName = (month: number) => {
    const monthNames = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];
    return monthNames[month - 1];
  };

  // Función para generar todos los meses del año con egresos
  const generateAllMonths = (expenseByMonth: { [key: string]: number }) => {
    const months = [];
    for (let i = 1; i <= 12; i++) {
      months.push({
        month: `${getMonthName(i)}`,
        Egreso: expenseByMonth[i] || 0,
      });
    }
    return months;
  };

  // Convertir expenseByMonth a un array para el gráfico
  const expenseByMonthArray = generateAllMonths(data?.expenseByMonth ?? []);

  // Función para formatear el eje X (mostrar todos los meses)
  const formatXAxis = (tickItem: string) => {
    return tickItem; // Mostrar todos los meses
  };

  // Función para cambiar de año (avanzar o retroceder)
  const changeYear = (direction: "prev" | "next") => {
    const newYear = direction === "prev" ? selectedYear - 1 : selectedYear + 1;
    setSelectedYear(newYear);
  };

  return (
    <Box className="p-6 bg-gray-50 min-h-screen">
      <Typography variant="h4" className="font-bold mb-6 text-gray-800">
        Egresos del Año
      </Typography>

      {/* Selector de Año con flechas */}
      <Box className="mb-6 flex items-center gap-4">
        <IconButton
          onClick={() => changeYear("prev")}
          className="text-gray-600"
        >
          <ChevronLeft />
        </IconButton>
        <Typography variant="h6" className="font-bold">
          {selectedYear}
        </Typography>
        <IconButton
          onClick={() => changeYear("next")}
          className="text-gray-600"
        >
          <ChevronRight />
        </IconButton>
      </Box>

      {/* Contenedor de Tarjetas */}
      <Box className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Tarjeta de Egresos Totales */}
        <Paper className="flex-1 p-6 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <Box className="flex items-center justify-between">
            <Typography variant="h6">Egresos Totales</Typography>
            <MoneyOff className="text-3xl" />
          </Box>
          <Typography variant="h4" className="mt-4 font-bold">
            ${data?.totalExpense.toLocaleString()}
          </Typography>
        </Paper>

        {/* Tarjeta de Transacciones */}
        <Paper className="flex-1 p-6 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <Box className="flex items-center justify-between">
            <Typography variant="h6">Transacciones</Typography>
            <Receipt className="text-3xl" />
          </Box>
          <Typography variant="h4" className="mt-4 font-bold">
            {data?.numberOfTransactions}
          </Typography>
        </Paper>

        {/* Tarjeta de Ticket Promedio */}
        <Paper className="flex-1 p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <Box className="flex items-center justify-between">
            <Typography variant="h6">Ticket Promedio</Typography>
            <TrendingDown className="text-3xl" />
          </Box>
          <Typography variant="h4" className="mt-4 font-bold">
            ${data?.averageTicket.toLocaleString()}
          </Typography>
        </Paper>
      </Box>

      {/* Gráfico de Egresos por Mes */}
      <Paper className="p-6 mb-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
        <Typography variant="h6" className="font-bold mb-4 text-gray-800">
          Egresos por Mes
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={expenseByMonthArray}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tickFormatter={formatXAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Egreso" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      {/* Tabla de Transacciones Recientes */}
      <Paper className="p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
        <Typography variant="h6" className="font-bold mb-4 text-gray-800">
          Transacciones Recientes
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Monto</TableCell>
                <TableCell>Atendido por</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.lastFiveTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>
                    {tx.createdAt
                      ? new Date(tx.createdAt).toLocaleString("es-ES", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true,
                        })
                      : "Fecha no disponible"}
                  </TableCell>
                  <TableCell>${tx.total.toLocaleString()}</TableCell>
                  <TableCell>{tx.user?.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default YearlyExpense;