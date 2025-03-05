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
  AttachMoney,
  TrendingUp,
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
import { useIncomeStore } from "../../../stores/income.store";

const DailyIncome: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { dailyIncome, getDailyIncome } = useIncomeStore();

  useEffect(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    const day = selectedDate.getDate();

    getDailyIncome(year, month, day);
  }, [selectedDate, getDailyIncome]);

  let data = dailyIncome;

  // Función para cambiar de día (avanzar o retroceder)
  const changeDate = (direction: "prev" | "next") => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + (direction === "prev" ? -1 : 1));
      return newDate;
    });
  };

  // Función para formatear la fecha como "día de mes, año"
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const generateAllHours = (incomeByHour: { [key: string]: number }) => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push({
        hour: `${i}:00`,
        Ingreso: incomeByHour[i] || 0,
      });
    }
    return hours;
  };

  const incomeByHourArray = generateAllHours(data?.incomeByHour ?? []);

  const formatXAxis = (tickItem: string) => {
    const hour = parseInt(tickItem.split(":")[0], 10);
    return hour % 2 === 0 ? tickItem : "";
  };

  return (
    <Box className="p-6 bg-gray-50 min-h-screen">
      <Typography variant="h4" className="font-bold mb-6 text-gray-800">
        Ingresos del Día
      </Typography>

      {/* Selector de fecha con flechas */}
      <Box className="mb-6 flex items-center gap-4">
        <IconButton
          onClick={() => changeDate("prev")}
          className="text-gray-600"
        >
          <ChevronLeft />
        </IconButton>
        <Typography variant="h6" className="font-bold">
          {formatDate(selectedDate)}
        </Typography>
        <IconButton
          onClick={() => changeDate("next")}
          className="text-gray-600"
        >
          <ChevronRight />
        </IconButton>
      </Box>

      {/* Contenedor de Tarjetas */}
      <Box className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Tarjeta de Ingresos Totales */}
        <Paper className="flex-1 p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <Box className="flex items-center justify-between">
            <Typography variant="h6">Ingresos Totales</Typography>
            <AttachMoney className="text-3xl" />
          </Box>
          <Typography variant="h4" className="mt-4 font-bold">
            ${data?.totalIncome.toLocaleString()}
          </Typography>
        </Paper>

        {/* Tarjeta de Transacciones */}
        <Paper className="flex-1 p-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <Box className="flex items-center justify-between">
            <Typography variant="h6">Transacciones</Typography>
            <Receipt className="text-3xl" />
          </Box>
          <Typography variant="h4" className="mt-4 font-bold">
            {data?.numberOfTransactions}
          </Typography>
        </Paper>

        {/* Tarjeta de Ticket Promedio */}
        <Paper className="flex-1 p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <Box className="flex items-center justify-between">
            <Typography variant="h6">Ticket Promedio</Typography>
            <TrendingUp className="text-3xl" />
          </Box>
          <Typography variant="h4" className="mt-4 font-bold">
            ${data?.averageTicket.toLocaleString()}
          </Typography>
        </Paper>
      </Box>

      {/* Gráfico de Ingresos por Hora */}
      <Paper className="p-6 mb-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
        <Typography variant="h6" className="font-bold mb-4 text-gray-800">
          Ingresos por Hora
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={incomeByHourArray}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" tickFormatter={formatXAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Ingreso" fill="#3b82f6" />
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

export default DailyIncome;
