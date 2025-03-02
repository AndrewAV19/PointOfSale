import React, { useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem } from '@mui/material';
import { MoneyOff, TrendingDown, Receipt, DateRange } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const YearlyExpenses: React.FC = () => {
  // Datos de ejemplo
  const [yearlyExpenses, setYearlyExpenses] = useState(3000000.50);
  const [transactions, setTransactions] = useState(11400);
  const [averageExpense, setAverageExpense] = useState(263.16);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Función para generar datos según el año seleccionado
  const generateData = (year: number) => {
    const targetDate = new Date(year, 0);

    // Datos simulados para el gráfico de egresos por mes
    const expensesByMonth = [
      { month: 'Enero', Egreso: 250000 + (year % 2020) * 10000 },
      { month: 'Febrero', Egreso: 260000 + (year % 2020) * 10000 },
      { month: 'Marzo', Egreso: 270000 + (year % 2020) * 10000 },
      { month: 'Abril', Egreso: 240000 + (year % 2020) * 10000 },
      { month: 'Mayo', Egreso: 280000 + (year % 2020) * 10000 },
      { month: 'Junio', Egreso: 290000 + (year % 2020) * 10000 },
      { month: 'Julio', Egreso: 300000 + (year % 2020) * 10000 },
      { month: 'Agosto', Egreso: 310000 + (year % 2020) * 10000 },
      { month: 'Septiembre', Egreso: 320000 + (year % 2020) * 10000 },
      { month: 'Octubre', Egreso: 330000 + (year % 2020) * 10000 },
      { month: 'Noviembre', Egreso: 340000 + (year % 2020) * 10000 },
      { month: 'Diciembre', Egreso: 350000 + (year % 2020) * 10000 },
    ];

    // Datos simulados para la tabla de transacciones recientes
    const recentTransactions = [
      { id: 1, date: `${targetDate.toISOString().split('T')[0]}`, amount: 12000.0 + (year % 2020) * 1000, category: 'Suministros' },
      { id: 2, date: `${targetDate.toISOString().split('T')[0]}`, amount: 15000.0 + (year % 2020) * 1000, category: 'Servicios' },
      { id: 3, date: `${targetDate.toISOString().split('T')[0]}`, amount: 20000.0 + (year % 2020) * 1000, category: 'Equipo' },
      { id: 4, date: `${targetDate.toISOString().split('T')[0]}`, amount: 18000.0 + (year % 2020) * 1000, category: 'Suministros' },
    ];

    // Datos simulados para las categorías de gastos
    const expenseCategories = [
      { category: 'Suministros', amount: 1200000 + (year % 2020) * 100000 },
      { category: 'Servicios', amount: 1400000 + (year % 2020) * 100000 },
      { category: 'Equipo', amount: 400000 + (year % 2020) * 50000 },
    ];

    return { expensesByMonth, recentTransactions, expenseCategories, targetDate };
  };

  console.log(setYearlyExpenses,setTransactions,setAverageExpense)

  // Obtener datos según el año seleccionado
  const { expensesByMonth, recentTransactions, expenseCategories, targetDate } = generateData(selectedYear);

  // Lista de años para el selector
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <Box className="p-6 bg-gray-50 min-h-screen">
      <Typography variant="h4" className="font-bold mb-6 text-gray-800">
        Egresos del Año
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
        {/* Tarjeta de Egresos Totales */}
        <Paper className="flex-1 p-6 bg-gradient-to-r from-rose-300 to-rose-400 text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <Box className="flex items-center justify-between">
            <Typography variant="h6">Egresos Totales</Typography>
            <MoneyOff className="text-3xl" />
          </Box>
          <Typography variant="h4" className="mt-4 font-bold">
            ${yearlyExpenses.toLocaleString()}
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

      {/* Gráfico de Egresos por Mes */}
      <Paper className="p-6 mb-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
        <Typography variant="h6" className="font-bold mb-4 text-gray-800">
          Egresos por Mes
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={expensesByMonth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
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

export default YearlyExpenses;