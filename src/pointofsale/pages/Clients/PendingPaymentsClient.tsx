import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TextField,
  InputAdornment,
  Card,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router";
import { dataStore } from "../../../stores/generalData.store";

const PendingPaymentsClient: React.FC = () => {
  const { selectedClient, clientDebts } = dataStore();
  const navigate = useNavigate();
  const [payments, setPayments] = useState(clientDebts);
  const [search, setSearch] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [remainingBalance, setRemainingBalance] = useState(0);

  console.log(setPayments);

  useEffect(() => {
    const total = payments.reduce(
      (sum, payment) => sum + payment.totalAmount,
      0
    );
    const paid = payments.reduce((sum, payment) => sum + payment.paidAmount, 0);
    const remaining = total - paid;

    setTotalAmount(total);
    setPaidAmount(paid);
    setRemainingBalance(remaining);
  }, [payments]);

  // Filtrar productos por nombre del producto
  const filteredProducts = payments.flatMap((payment) =>
    payment.products
      .filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      )
      .map((product) => ({ ...product, client: payment.client }))
  );

  // Regresar a la página anterior
  const handleGoBack = () => {
    navigate(-1);
  };

  // Manejar cambios en el campo "Pagado"
  const handlePaidAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newPaidAmount = parseFloat(event.target.value);
    setPaidAmount(newPaidAmount);
    setRemainingBalance(totalAmount - newPaidAmount);
  };

  return (
    <Container sx={{ py: 4 }}>
      {/* Botón para regresar */}
      <Box sx={{ marginBottom: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
        >
          Regresar
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          sx={{ mb: 1 }}
        >
          Adeudos pendientes de {selectedClient?.name}
        </Typography>

        <Typography
          variant="body2"
          align="center"
          sx={{ color: "gray", mb: 4 }}
        >
          Esta pestaña es solo informativa
        </Typography>

        <TextField
          fullWidth
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
          sx={{ mb: 3 }}
        />

        {/* Tabla de productos */}
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell align="left">Nombre</TableCell>
              <TableCell align="left">Cantidad</TableCell>
              <TableCell align="left">Precio</TableCell>
              <TableCell align="left">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    No hay productos que coincidan con la búsqueda.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>${product.quantity * product.price}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Total, Pagado, Faltante */}
        <Card
          elevation={1}
          sx={{
            mt: 4,
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            textAlign: "center",
          }}
        >
          <TextField
            label="Total"
            value={totalAmount.toFixed(2)}
            disabled
            sx={{ width: "150px" }}
          />
          <TextField
            label="Pagado"
            value={paidAmount.toFixed(2)}
            onChange={handlePaidAmountChange}
            disabled
            sx={{ width: "150px" }}
          />

          <TextField
            label="Faltante"
            value={remainingBalance.toFixed(2)}
            disabled
            sx={{ width: "150px" }}
          />
        </Card>
      </Paper>
    </Container>
  );
};

export default PendingPaymentsClient;
