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

const MonthlyIncome: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { monthlyIncome, getMonthlyIncome } = useIncomeStore();

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    getMonthlyIncome(year, month);
  }, [currentDate, getMonthlyIncome]);

  let data = monthlyIncome;

  // Función para obtener el nombre completo del mes
  const getMonthName = (date: Date) => {
    const monthNames = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    return monthNames[date.getMonth()];
  };

  // Función para formatear la fecha como "Mes de Año"
  const formatDate = (date: Date) => {
    return `${getMonthName(date)} de ${date.getFullYear()}`;
  };

  // Función para cambiar de mes (avanzar o retroceder)
  const changeMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  // Función para generar todos los días del mes con ingresos
  const generateAllDays = (
    incomeByDay: { [key: string]: number },
    date: Date
  ) => {
    const daysInMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: `${i}/${getMonthName(date).substring(0, 3)}`,
        Ingreso: incomeByDay[i] || 0,
      });
    }
    return days;
  };

  // Convertir incomeByDay a un array para el gráfico
  const incomeByDayArray = generateAllDays(
    data?.incomeByDay ?? [],
    currentDate
  );

  // Función para formatear el eje X (mostrar días de 5 en 5)
  const formatXAxis = (tickItem: string) => {
    const day = parseInt(tickItem.split("/")[0], 10);
    return day % 5 === 0 ? tickItem : "";
  };

  return (
    <Box className="p-6 bg-gray-50 min-h-screen">
      <Typography variant="h4" className="font-bold mb-6 text-gray-800">
        Ingresos del Mes
      </Typography>

      {/* Selector de Mes y Año con flechas */}
      <Box className="mb-6 flex items-center gap-4">
        <IconButton
          onClick={() => changeMonth("prev")}
          className="text-gray-600"
        >
          <ChevronLeft />
        </IconButton>
        <Typography variant="h6" className="font-bold">
          {formatDate(currentDate)}
        </Typography>
        <IconButton
          onClick={() => changeMonth("next")}
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

      {/* Gráfico de Ingresos por Día */}
      <Paper className="p-6 mb-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
        <Typography variant="h6" className="font-bold mb-4 text-gray-800">
          Ingresos por Día
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={incomeByDayArray}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" tickFormatter={formatXAxis} />
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

export default MonthlyIncome;
