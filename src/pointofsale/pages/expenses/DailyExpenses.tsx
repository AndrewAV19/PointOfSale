import React, { useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem } from '@mui/material';
import { MoneyOff, TrendingDown, Receipt, DateRange } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DailyExpenses: React.FC = () => {
  // Datos de ejemplo
  const [dailyExpenses, setDailyExpenses] = useState(8500.50);
  const [transactions, setTransactions] = useState(35);
  const [averageExpense, setAverageExpense] = useState(242.87);
  const [selectedDaysAgo, setSelectedDaysAgo] = useState(0);

  // Función para generar datos según los días atrás seleccionados
  const generateData = (daysAgo: number) => {
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() - daysAgo);

    // Datos simulados para el gráfico de egresos por hora
    const expensesByHour = [
      { hour: '09:00', Egreso: 800 + (daysAgo * 50) },
      { hour: '10:00', Egreso: 1200 + (daysAgo * 50) },
      { hour: '11:00', Egreso: 900 + (daysAgo * 50) },
      { hour: '12:00', Egreso: 1500 + (daysAgo * 50) },
      { hour: '13:00', Egreso: 1300 + (daysAgo * 50) },
      { hour: '14:00', Egreso: 1100 + (daysAgo * 50) },
      { hour: '15:00', Egreso: 1400 + (daysAgo * 50) },
      { hour: '16:00', Egreso: 1000 + (daysAgo * 50) },
      { hour: '17:00', Egreso: 900 + (daysAgo * 50) },
    ];

    // Datos simulados para la tabla de transacciones recientes
    const recentTransactions = [
      { id: 1, date: `${targetDate.toISOString().split('T')[0]} 09:15`, amount: 100.0 + (daysAgo * 10), category: 'Suministros' },
      { id: 2, date: `${targetDate.toISOString().split('T')[0]} 10:30`, amount: 150.0 + (daysAgo * 10), category: 'Servicios' },
      { id: 3, date: `${targetDate.toISOString().split('T')[0]} 11:45`, amount: 200.0 + (daysAgo * 10), category: 'Equipo' },
      { id: 4, date: `${targetDate.toISOString().split('T')[0]} 12:00`, amount: 180.0 + (daysAgo * 10), category: 'Suministros' },
    ];

    // Datos simulados para las categorías de gastos
    const expenseCategories = [
      { category: 'Suministros', amount: 3000 + (daysAgo * 100) },
      { category: 'Servicios', amount: 4000 + (daysAgo * 100) },
      { category: 'Equipo', amount: 1500 + (daysAgo * 50) },
    ];

    return { expensesByHour, recentTransactions, expenseCategories, targetDate };
  };

  // Obtener datos según los días atrás seleccionados
  const { expensesByHour, recentTransactions, expenseCategories, targetDate } = generateData(selectedDaysAgo);

  return (
    <Box className="p-6 bg-gray-50 min-h-screen">
      <Typography variant="h4" className="font-bold mb-6 text-gray-800">
        Egresos del Día
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
        {/* Tarjeta de Egresos Totales */}
        <Paper className="flex-1 p-6 bg-gradient-to-r from-rose-300 to-rose-400 text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <Box className="flex items-center justify-between">
            <Typography variant="h6">Egresos Totales</Typography>
            <MoneyOff className="text-3xl" />
          </Box>
          <Typography variant="h4" className="mt-4 font-bold">
            ${dailyExpenses.toLocaleString()}
          </Typography>
        </Paper>

        {/* Tarjeta de Transacciones */}
        <Paper className="flex-1 p-6 bg-gradient-to-r from-orange-300 to-orange-400 text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <Box className="flex items-center justify-between">
            <Typography variant="h6">Transacciones</Typography>
            <Receipt className="text-3xl" />
          </Box>
          <Typography variant="h4" className="mt-4 font-bold">
            {transactions}
          </Typography>
        </Paper>

        {/* Tarjeta de Gasto Promedio */}
        <Paper className="flex-1 p-6 bg-gradient-to-r from-pink-300 to-pink-400 text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <Box className="flex items-center justify-between">
            <Typography variant="h6">Gasto Promedio</Typography>
            <TrendingDown className="text-3xl" />
          </Box>
          <Typography variant="h4" className="mt-4 font-bold">
            ${averageExpense.toLocaleString()}
          </Typography>
        </Paper>
      </Box>

      {/* Gráfico de Egresos por Hora */}
      <Paper className="p-6 mb-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
        <Typography variant="h6" className="font-bold mb-4 text-gray-800">
          Egresos por Hora
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={expensesByHour}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Egreso" fill="#fb7185" /> {/* Color rose-400 */}
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      {/* Tarjeta de Categorías de Gastos */}
      <Paper className="p-6 mb-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
        <Typography variant="h6" className="font-bold mb-4 text-gray-800">
          Categorías de Gastos
        </Typography>
        <Box className="flex flex-col gap-4">
          {expenseCategories.map((ec) => (
            <Box key={ec.category} className="flex justify-between items-center">
              <Typography>{ec.category}</Typography>
              <Typography className="font-bold">${ec.amount.toLocaleString()}</Typography>
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
                <TableCell>Categoría</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{tx.date}</TableCell>
                  <TableCell>${tx.amount.toLocaleString()}</TableCell>
                  <TableCell>{tx.category}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default DailyExpenses;