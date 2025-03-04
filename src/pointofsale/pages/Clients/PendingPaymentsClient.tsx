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
  Snackbar,
  Alert,
  TextField,
  InputAdornment,
  IconButton,
  Card,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { dataStore } from "../../../stores/generalData.store";
import ConfirmLiquidarModal from "../../modales/ModalConfirmLiquidar";

const PendingPaymentsClient: React.FC = () => {
  const { selectedClient, clientDebts } = dataStore();
  const navigate = useNavigate();
  const [payments, setPayments] = useState(clientDebts);
  const [search, setSearch] = useState("");
  const [openLiquidarModal, setOpenLiquidarModal] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [remainingBalance, setRemainingBalance] = useState(0);

  const {
    openSnackbar,
    snackbarSeverity,
    messageSnackbar,
    showSnackbar,
    closeSnackbar,
  } = useSnackbar();

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

  // Abrir modal de confirmación para liquidar la cuenta
  const handleOpenLiquidarModal = () => {
    setOpenLiquidarModal(true);
  };

  // Cerrar modal de confirmación para liquidar la cuenta
  const handleCloseLiquidarModal = () => {
    setOpenLiquidarModal(false);
  };

  // Manejar la liquidación de la cuenta completa
  const handleConfirmLiquidarCuenta = () => {
    setPayments([]);

    setTotalAmount(0);
    setPaidAmount(0);
    setRemainingBalance(0);

    // Mostrar mensaje de éxito
    showSnackbar("success", "Cuenta liquidada completamente.");

    // Cerrar el modal de confirmación
    handleCloseLiquidarModal();
  };

  // Manejar cambios en el campo "Pagado"
  const handlePaidAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newPaidAmount = parseFloat(event.target.value);
    setPaidAmount(newPaidAmount);
    setRemainingBalance(totalAmount - newPaidAmount);
  };

  // Manejar la reducción de la cantidad de un producto
  const handleReduceQuantity = (productId: number) => {
    const updatedPayments = payments.map((payment) => {
      const updatedProducts = payment.products.map((product) =>
        product.id === productId && product.quantity > 1
          ? { ...product, quantity: product.quantity - 1 }
          : product
      );

      const newTotalAmount = updatedProducts.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0
      );

      return {
        ...payment,
        products: updatedProducts,
        totalAmount: newTotalAmount,
      };
    });

    // Actualizar los pagos
    setPayments(updatedPayments);
  };

  // Manejar la eliminación de un producto
  const handleRemoveProduct = (productId: number) => {
    const updatedPayments = payments.map((payment) => {
      const updatedProducts = payment.products.filter(
        (product) => product.id !== productId
      );

      const newTotalAmount = updatedProducts.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0
      );

      return {
        ...payment,
        products: updatedProducts,
        totalAmount: newTotalAmount,
      };
    });

    setPayments(updatedPayments);
  };

  // Función para actualizar los pagos
  const handleUpdatePayments = () => {
    showSnackbar("success", "Pagos actualizados correctamente.");
  };

  // Función para limpiar los campos
  const handleClearFields = () => {
    setSearch(""); 
    setPaidAmount(0);
    setRemainingBalance(totalAmount); 
    showSnackbar("success", "Campos limpiados correctamente.");
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
          sx={{ mb: 4 }}
        >
          Pagos Pendientes de {selectedClient?.name}
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
              <TableCell align="left">Acciones</TableCell>
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
                  <TableCell>
                    <IconButton
                      onClick={() => handleReduceQuantity(product.id)}
                      disabled={product.quantity <= 1}
                      color="error"
                    >
                      <RemoveIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleRemoveProduct(product.id)}
                      color="error"
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Total, Pagado, Faltante y botón de liquidar cuenta */}
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
            sx={{ width: "150px" }}
          />

          <TextField
            label="Faltante"
            value={remainingBalance.toFixed(2)}
            disabled
            sx={{ width: "150px" }}
          />
        </Card>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleUpdatePayments}
          >
            Actualizar Pagos
          </Button>
          <Button
            variant="outlined"
            color="error"
            sx={{
              borderRadius: 2,
              padding: "10px 20px",
              fontWeight: "bold",
              borderColor: "#d32f2f",
              "&:hover": {
                borderColor: "#b71c1c",
                backgroundColor: "#ffebee",
              },
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            }}
            onClick={handleClearFields}
          >
            Limpiar Campos
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenLiquidarModal}
          >
            Liquidar Cuenta
          </Button>
        </Box>
      </Paper>

      {/* Modal de Confirmación para Liquidar Cuenta */}
      <ConfirmLiquidarModal
        open={openLiquidarModal}
        onClose={handleCloseLiquidarModal}
        onConfirm={handleConfirmLiquidarCuenta}
        totalAmount={totalAmount}
      />

      {/* Snackbar de confirmación y errores */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbarSeverity} sx={{ width: "100%" }}>
          {messageSnackbar}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PendingPaymentsClient;
