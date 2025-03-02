import React, { useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem } from '@mui/material';
import { AttachMoney, TrendingUp, Receipt, DateRange } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MonthlyIncome: React.FC = () => {
  // Datos de ejemplo
  const [monthlyIncome, setMonthlyIncome] = useState(375000.75);
  const [transactions, setTransactions] = useState(1260);
  const [averageTicket, setAverageTicket] = useState(297.64);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Función para generar datos según el mes y año seleccionados
  const generateData = (month: number, year: number) => {
    const targetDate = new Date(year, month);

    // Datos simulados para el gráfico de ingresos por día
    const incomeByDay = Array.from({ length: 30 }, (_, i) => ({
      day: `Día ${i + 1}`,
      Ingreso: 10000 + (i * 500) + (month * 1000),
    }));

    // Datos simulados para la tabla de transacciones recientes
    const recentTransactions = [
      { id: 1, date: `${targetDate.toISOString().split('T')[0]}`, amount: 1500.0 + (month * 100), method: 'Tarjeta' },
      { id: 2, date: `${targetDate.toISOString().split('T')[0]}`, amount: 2000.0 + (month * 100), method: 'Efectivo' },
      { id: 3, date: `${targetDate.toISOString().split('T')[0]}`, amount: 3000.0 + (month * 100), method: 'Transferencia' },
      { id: 4, date: `${targetDate.toISOString().split('T')[0]}`, amount: 2500.0 + (month * 100), method: 'Tarjeta' },
    ];

    // Datos simulados para los métodos de pago
    const paymentMethods = [
      { method: 'Efectivo', amount: 150000 + (month * 1000) },
      { method: 'Tarjeta', amount: 200000 + (month * 1000) },
      { method: 'Transferencia', amount: 25000 + (month * 500) },
    ];

    return { incomeByDay, recentTransactions, paymentMethods, targetDate };
  };

  // Obtener datos según el mes y año seleccionados
  const { incomeByDay, recentTransactions, paymentMethods, targetDate } = generateData(selectedMonth, selectedYear);

  // Lista de meses para el selector
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Lista de años para el selector
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <Box className="p-6 bg-gray-50 min-h-screen">
      <Typography variant="h4" className="font-bold mb-6 text-gray-800">
        Ingresos del Mes
      </Typography>

      {/* Filtro de Mes y Año */}
      <Box className="mb-6 flex items-center gap-4">
        <DateRange className="text-gray-600" />
        <Select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="bg-white"
        >
          {months.map((month, index) => (
            <MenuItem key={month} value={index}>{month}</MenuItem>
          ))}
        </Select>
        <Select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="bg-white"
        >
          {years.map((year) => (
            <MenuItem key={year} value={year}>{year}</MenuItem>
          ))}
        </Select>
        <Typography className="text-gray-600">
          {targetDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
        </Typography>
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
            ${monthlyIncome.toLocaleString()}
          </Typography>
        </Paper>

        {/* Tarjeta de Transacciones */}
        <Paper className="flex-1 p-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <Box className="flex items-center justify-between">
            <Typography variant="h6">Transacciones</Typography>
            <Receipt className="text-3xl" />
          </Box>
          <Typography variant="h4" className="mt-4 font-bold">
            {transactions}
          </Typography>
        </Paper>

        {/* Tarjeta de Ticket Promedio */}
        <Paper className="flex-1 p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <Box className="flex items-center justify-between">
            <Typography variant="h6">Ticket Promedio</Typography>
            <TrendingUp className="text-3xl" />
          </Box>
          <Typography variant="h4" className="mt-4 font-bold">
            ${averageTicket.toLocaleString()}
          </Typography>
        </Paper>
      </Box>

      {/* Gráfico de Ingresos por Día */}
      <Paper className="p-6 mb-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
        <Typography variant="h6" className="font-bold mb-4 text-gray-800">
          Ingresos por Día
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={incomeByDay}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Ingreso" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      {/* Tarjeta de Métodos de Pago */}
      <Paper className="p-6 mb-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
        <Typography variant="h6" className="font-bold mb-4 text-gray-800">
          Métodos de Pago
        </Typography>
        <Box className="flex flex-col gap-4">
          {paymentMethods.map((pm) => (
            <Box key={pm.method} className="flex justify-between items-center">
              <Typography>{pm.method}</Typography>
              <Typography className="font-bold">${pm.amount.toLocaleString()}</Typography>
            </Box>
          ))}
        </Box>
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
                <TableCell>Método</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{tx.date}</TableCell>
                  <TableCell>${tx.amount.toLocaleString()}</TableCell>
                  <TableCell>{tx.method}</TableCell>
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