import React, { useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem } from '@mui/material';
import { AttachMoney, TrendingUp, Receipt, DateRange } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DailyIncome: React.FC = () => {
  // Datos de ejemplo
  const [dailyIncome, setDailyIncome] = useState(12500.75);
  const [transactions, setTransactions] = useState(42);
  const [averageTicket, setAverageTicket] = useState(297.64);
  const [selectedDaysAgo, setSelectedDaysAgo] = useState(0); 

  // Función para generar datos según los días atrás seleccionados
  const generateData = (daysAgo: number) => {
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() - daysAgo);

    // Datos simulados para el gráfico de ingresos por hora
    const incomeByHour = [
      { hour: '09:00', Ingreso: 1200 + (daysAgo * 100) },
      { hour: '10:00', Ingreso: 1800 + (daysAgo * 100) },
      { hour: '11:00', Ingreso: 1500 + (daysAgo * 100) },
      { hour: '12:00', Ingreso: 2200 + (daysAgo * 100) },
      { hour: '13:00', Ingreso: 1900 + (daysAgo * 100) },
      { hour: '14:00', Ingreso: 2100 + (daysAgo * 100) },
      { hour: '15:00', Ingreso: 2400 + (daysAgo * 100) },
      { hour: '16:00', Ingreso: 1800 + (daysAgo * 100) },
      { hour: '17:00', Ingreso: 1600 + (daysAgo * 100) },
    ];

    // Datos simulados para la tabla de transacciones recientes
    const recentTransactions = [
      { id: 1, date: `${targetDate.toISOString().split('T')[0]} 09:15`, amount: 150.0 + (daysAgo * 10), method: 'Tarjeta' },
      { id: 2, date: `${targetDate.toISOString().split('T')[0]} 10:30`, amount: 200.0 + (daysAgo * 10), method: 'Efectivo' },
      { id: 3, date: `${targetDate.toISOString().split('T')[0]} 11:45`, amount: 300.0 + (daysAgo * 10), method: 'Transferencia' },
      { id: 4, date: `${targetDate.toISOString().split('T')[0]} 12:00`, amount: 250.0 + (daysAgo * 10), method: 'Tarjeta' },
    ];

    // Datos simulados para los métodos de pago
    const paymentMethods = [
      { method: 'Efectivo', amount: 5000 + (daysAgo * 100) },
      { method: 'Tarjeta', amount: 7000 + (daysAgo * 100) },
      { method: 'Transferencia', amount: 500 + (daysAgo * 50) },
    ];

    return { incomeByHour, recentTransactions, paymentMethods, targetDate };
  };

  // Obtener datos según los días atrás seleccionados
  const { incomeByHour, recentTransactions, paymentMethods, targetDate } = generateData(selectedDaysAgo);

  return (
    <Box className="p-6 bg-gray-50 min-h-screen">
      <Typography variant="h4" className="font-bold mb-6 text-gray-800">
        Ingresos del Día
      </Typography>

      {/* Filtro de Días Atrás */}
      <Box className="mb-6 flex items-center gap-4">
        <DateRange className="text-gray-600" />
        <Select
          value={selectedDaysAgo}
          onChange={(e) => setSelectedDaysAgo(Number(e.target.value))}
          className="bg-white"
        >
          <MenuItem value={0}>Hoy</MenuItem>
          <MenuItem value={1}>Ayer</MenuItem>
          <MenuItem value={2}>Hace 2 días</MenuItem>
          <MenuItem value={3}>Hace 3 días</MenuItem>
          <MenuItem value={7}>Hace 1 semana</MenuItem>
        </Select>
        <Typography className="text-gray-600">
          {targetDate.toLocaleDateString()}
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
            ${dailyIncome.toLocaleString()}
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

      {/* Gráfico de Ingresos por Hora */}
      <Paper className="p-6 mb-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
        <Typography variant="h6" className="font-bold mb-4 text-gray-800">
          Ingresos por Hora
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={incomeByHour}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
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

export default DailyIncome;