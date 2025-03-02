import React, { useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem } from '@mui/material';
import { AttachMoney, TrendingUp, Receipt, DateRange } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const YearlyIncome: React.FC = () => {
  // Datos de ejemplo
  const [yearlyIncome, setYearlyIncome] = useState(4500000.75);
  const [transactions, setTransactions] = useState(15120);
  const [averageTicket, setAverageTicket] = useState(297.64);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Función para generar datos según el año seleccionado
  const generateData = (year: number) => {
    const targetDate = new Date(year, 0);

    // Datos simulados para el gráfico de ingresos por mes
    const incomeByMonth = [
      { month: 'Enero', Ingreso: 375000 + (year % 2020) * 10000 },
      { month: 'Febrero', Ingreso: 400000 + (year % 2020) * 10000 },
      { month: 'Marzo', Ingreso: 420000 + (year % 2020) * 10000 },
      { month: 'Abril', Ingreso: 390000 + (year % 2020) * 10000 },
      { month: 'Mayo', Ingreso: 410000 + (year % 2020) * 10000 },
      { month: 'Junio', Ingreso: 430000 + (year % 2020) * 10000 },
      { month: 'Julio', Ingreso: 440000 + (year % 2020) * 10000 },
      { month: 'Agosto', Ingreso: 450000 + (year % 2020) * 10000 },
      { month: 'Septiembre', Ingreso: 460000 + (year % 2020) * 10000 },
      { month: 'Octubre', Ingreso: 470000 + (year % 2020) * 10000 },
      { month: 'Noviembre', Ingreso: 480000 + (year % 2020) * 10000 },
      { month: 'Diciembre', Ingreso: 500000 + (year % 2020) * 10000 },
    ];

    // Datos simulados para la tabla de transacciones recientes
    const recentTransactions = [
      { id: 1, date: `${targetDate.toISOString().split('T')[0]}`, amount: 15000.0 + (year % 2020) * 1000, method: 'Tarjeta' },
      { id: 2, date: `${targetDate.toISOString().split('T')[0]}`, amount: 20000.0 + (year % 2020) * 1000, method: 'Efectivo' },
      { id: 3, date: `${targetDate.toISOString().split('T')[0]}`, amount: 30000.0 + (year % 2020) * 1000, method: 'Transferencia' },
      { id: 4, date: `${targetDate.toISOString().split('T')[0]}`, amount: 25000.0 + (year % 2020) * 1000, method: 'Tarjeta' },
    ];

    // Datos simulados para los métodos de pago
    const paymentMethods = [
      { method: 'Efectivo', amount: 1800000 + (year % 2020) * 100000 },
      { method: 'Tarjeta', amount: 2400000 + (year % 2020) * 100000 },
      { method: 'Transferencia', amount: 300000 + (year % 2020) * 50000 },
    ];

    return { incomeByMonth, recentTransactions, paymentMethods, targetDate };
  };

  // Obtener datos según el año seleccionado
  const { incomeByMonth, recentTransactions, paymentMethods, targetDate } = generateData(selectedYear);

  // Lista de años para el selector
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <Box className="p-6 bg-gray-50 min-h-screen">
      <Typography variant="h4" className="font-bold mb-6 text-gray-800">
        Ingresos del Año
      </Typography>

      {/* Filtro de Año */}
      <Box className="mb-6 flex items-center gap-4">
        <DateRange className="text-gray-600" />
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
          {targetDate.toLocaleDateString('es-ES', { year: 'numeric' })}
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
            ${yearlyIncome.toLocaleString()}
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

      {/* Gráfico de Ingresos por Mes */}
      <Paper className="p-6 mb-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
        <Typography variant="h6" className="font-bold mb-4 text-gray-800">
          Ingresos por Mes
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={incomeByMonth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
          
            <Bar dataKey="Egreso" fill="#fb7185" /> 
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

export default YearlyIncome;