import React, { useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem } from '@mui/material';
import { MoneyOff, TrendingDown, Receipt, DateRange } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MonthlyExpenses: React.FC = () => {
  // Datos de ejemplo
  const [monthlyExpenses, setMonthlyExpenses] = useState(255000.50);
  const [transactions, setTransactions] = useState(950);
  const [averageExpense, setAverageExpense] = useState(268.42);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Función para generar datos según el mes y año seleccionados
  const generateData = (month: number, year: number) => {
    const targetDate = new Date(year, month);

    // Datos simulados para el gráfico de egresos por día
    const expensesByDay = Array.from({ length: 30 }, (_, i) => ({
      day: `Día ${i + 1}`,
      Egreso: 8000 + (i * 300) + (month * 500),
    }));

    // Datos simulados para la tabla de transacciones recientes
    const recentTransactions = [
      { id: 1, date: `${targetDate.toISOString().split('T')[0]}`, amount: 1200.0 + (month * 100), category: 'Suministros' },
      { id: 2, date: `${targetDate.toISOString().split('T')[0]}`, amount: 1500.0 + (month * 100), category: 'Servicios' },
      { id: 3, date: `${targetDate.toISOString().split('T')[0]}`, amount: 2000.0 + (month * 100), category: 'Equipo' },
      { id: 4, date: `${targetDate.toISOString().split('T')[0]}`, amount: 1800.0 + (month * 100), category: 'Suministros' },
    ];

    // Datos simulados para las categorías de gastos
    const expenseCategories = [
      { category: 'Suministros', amount: 100000 + (month * 1000) },
      { category: 'Servicios', amount: 120000 + (month * 1000) },
      { category: 'Equipo', amount: 35000 + (month * 500) },
    ];

    return { expensesByDay, recentTransactions, expenseCategories, targetDate };
  };

  // Obtener datos según el mes y año seleccionados
  const { expensesByDay, recentTransactions, expenseCategories, targetDate } = generateData(selectedMonth, selectedYear);

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
        Egresos del Mes
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
        {/* Tarjeta de Egresos Totales */}
        <Paper className="flex-1 p-6 bg-gradient-to-r from-rose-300 to-rose-400 text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <Box className="flex items-center justify-between">
            <Typography variant="h6">Egresos Totales</Typography>
            <MoneyOff className="text-3xl" />
          </Box>
          <Typography variant="h4" className="mt-4 font-bold">
            ${monthlyExpenses.toLocaleString()}
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

      {/* Gráfico de Egresos por Día */}
      <Paper className="p-6 mb-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
        <Typography variant="h6" className="font-bold mb-4 text-gray-800">
          Egresos por Día
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={expensesByDay}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
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

export default MonthlyExpenses;