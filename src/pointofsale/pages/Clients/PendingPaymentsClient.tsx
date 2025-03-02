import React, { useState } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Payment as PaymentIcon,
  Search as SearchIcon,
  Cancel as CancelIcon,
  Done as DoneIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { dataStore } from "../../../stores/generalData.store";
import ConfirmModal from "../../../components/ConfirmModal";

// Datos de ejemplo (simulación de productos pendientes)
const pendingProducts = [
  { id: 1, name: "Producto A", amount: 100.0, paid: 0 },
  { id: 2, name: "Producto B", amount: 200.0, paid: 0 },
  { id: 3, name: "Producto C", amount: 150.0, paid: 100 },
];

const PendingPaymentsClient: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState(pendingProducts);
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [openAbonarModal, setOpenAbonarModal] = useState(false);
  const [abonoAmount, setAbonoAmount] = useState(0);
  const [currentProduct, setCurrentProduct] = useState<{
    id: number;
    name: string;
    amount: number;
    paid: number;
  } | null>(null);
  const [openLiquidarModal, setOpenLiquidarModal] = useState(false);

  const { selectedClient } = dataStore();
  const {
    openSnackbar,
    snackbarSeverity,
    messageSnackbar,
    showSnackbar,
    closeSnackbar,
  } = useSnackbar();

  // Filtrar productos por nombre
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  // Calcular el total y el faltante a pagar
  const totalAmount = products.reduce(
    (sum, product) => sum + product.amount,
    0
  );
  const totalPaid = products.reduce((sum, product) => sum + product.paid, 0);
  const totalRemaining = totalAmount - totalPaid;

  // Abrir modal de abono
  const handleOpenAbonarModal = (product: {
    id: number;
    name: string;
    amount: number;
    paid: number;
  }) => {
    setCurrentProduct(product);
    setOpenAbonarModal(true);
  };

  // Cerrar modal de abono
  const handleCloseAbonarModal = () => {
    setOpenAbonarModal(false);
    setAbonoAmount(0);
    setCurrentProduct(null);
  };

  // Manejar el abono
  const handleAbonar = () => {
    if (currentProduct && abonoAmount > 0) {
      const updatedProducts = products.map((product) =>
        product.id === currentProduct.id
          ? { ...product, paid: product.paid + abonoAmount }
          : product
      );
      setProducts(updatedProducts);
      showSnackbar("success", "Abono registrado correctamente.");
      handleCloseAbonarModal();
    } else {
      showSnackbar("error", "Ingresa un monto válido.");
    }
  };

  // Manejar la marca de cuenta saldada
  const handleMarkAsSettled = (id: number) => {
    setSelectedProductId(id);
    setOpenDialog(true);
  };

  // Confirmar la marca de cuenta saldada
  const handleConfirmSettled = () => {
    if (selectedProductId) {
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== selectedProductId)
      );
      showSnackbar("success", "Cuenta marcada como saldada.");
      setOpenDialog(false);
    }
  };

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
    const updatedProducts = products.map((product) => ({
      ...product,
      paid: product.amount,
    }));
    setProducts(updatedProducts);
    showSnackbar("success", "Cuenta liquidada completamente.");
    handleCloseLiquidarModal();
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
          component="h1"
          sx={{ mb: 4, textAlign: "center", fontWeight: "bold" }}
        >
          Pagos Pendientes de {selectedClient?.name}
        </Typography>

        {/* Barra de búsqueda */}
        <Box sx={{ mb: 4 }}>
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
          />
        </Box>

        {/* Tabla de productos pendientes */}
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>Producto</TableCell>
              <TableCell align="right">Monto Total</TableCell>
              <TableCell align="right">Abonado</TableCell>
              <TableCell align="right">Saldo Restante</TableCell>
              <TableCell align="center">Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    No hay productos pendientes.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => {
                const saldoRestante = product.amount - product.paid;
                return (
                  <TableRow key={product.id} hover>
                    <TableCell>{product.name}</TableCell>
                    <TableCell align="right">
                      ${product.amount.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      ${product.paid.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      ${saldoRestante.toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      {saldoRestante <= 0 ? (
                        <Typography color="success.main" fontWeight="bold">
                          Pagado
                        </Typography>
                      ) : (
                        <Typography color="error.main" fontWeight="bold">
                          Pendiente
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {saldoRestante > 0 && (
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<PaymentIcon />}
                          onClick={() => handleOpenAbonarModal(product)}
                          sx={{ mr: 1 }}
                        >
                          Abonar
                        </Button>
                      )}
                      <Button
                        variant="outlined"
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleMarkAsSettled(product.id)}
                      >
                        Saldada
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Total y botón de liquidar cuenta */}
        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Total: ${totalAmount.toFixed(2)}</Typography>
          <Typography variant="h6">
            Faltante: ${totalRemaining.toFixed(2)}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenLiquidarModal}
          >
            Liquidar Cuenta
          </Button>
        </Box>
      </Paper>

      {/* Modal de Abono */}
      <Dialog
        open={openAbonarModal}
        onClose={handleCloseAbonarModal}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: 3,
            boxShadow: 3,
            maxWidth: "400px",
            width: "100%",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            backgroundColor: "#f8f9fa",
            borderBottom: "1px solid #e9ecef",
            py: 2,
          }}
        >
          <PaymentIcon
            color="primary"
            fontSize="large"
            sx={{ fontSize: "2.5rem" }}
          />{" "}
          {/* Ícono de pago más grande */}
          <Typography variant="h6" fontWeight="bold" color="text.primary">
            Abonar a {currentProduct?.name}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ py: 3, textAlign: "center" }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" color="text.secondary">
              Monto total:{" "}
              <strong style={{ color: "#1976d2" }}>
                ${currentProduct?.amount.toFixed(2)}
              </strong>
            </Typography>
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" color="text.secondary">
              Abonado:{" "}
              <strong style={{ color: "#4caf50" }}>
                ${currentProduct?.paid.toFixed(2)}
              </strong>
            </Typography>
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" color="text.secondary">
              Saldo restante:{" "}
              <strong style={{ color: "#d32f2f" }}>
                $
                {(currentProduct
                  ? currentProduct.amount - currentProduct.paid
                  : 0
                ).toFixed(2)}
              </strong>
            </Typography>
          </Box>
          <TextField
            fullWidth
            label="Monto a abonar"
            type="number"
            value={abonoAmount}
            onChange={(e) => setAbonoAmount(parseFloat(e.target.value))}
            sx={{ mt: 2 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              },
            }}
          />
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "center",
            gap: 2,
            py: 2,
            backgroundColor: "#f8f9fa",
            borderTop: "1px solid #e9ecef",
          }}
        >
          <Button
            onClick={handleCloseAbonarModal}
            variant="outlined"
            color="error"
            startIcon={<CancelIcon />}
            sx={{
              px: 4,
              py: 1,
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleAbonar}
            variant="contained"
            color="success"
            startIcon={<DoneIcon />}
            sx={{
              px: 4,
              py: 1,
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            Abonar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Confirmación para Liquidar Cuenta */}
      <Dialog
        open={openLiquidarModal}
        onClose={handleCloseLiquidarModal}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: 3,
            boxShadow: 3,
            maxWidth: "400px",
            width: "100%",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            backgroundColor: "#f8f9fa",
            borderBottom: "1px solid #e9ecef",
            py: 2, // Padding vertical
          }}
        >
          {/* Ícono de advertencia más grande */}
          <Typography variant="h6" fontWeight="bold" color="text.primary">
            Confirmar Liquidación
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ py: 3, textAlign: "center" }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Estás a punto de liquidar la cuenta completa por un monto total de:
          </Typography>
          <Typography
            variant="h5"
            fontWeight="bold"
            color="primary"
            sx={{ mb: 3, fontSize: "1.75rem" }}
          >
            ${totalAmount.toFixed(2)}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            ¿Estás seguro de continuar?
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "center",
            gap: 2,
            py: 2,
            backgroundColor: "#f8f9fa",
            borderTop: "1px solid #e9ecef",
          }}
        >
          <Button
            onClick={handleCloseLiquidarModal}
            variant="outlined"
            color="error"
            startIcon={<CancelIcon />}
            sx={{
              px: 4,
              py: 1,
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmLiquidarCuenta}
            variant="contained"
            color="success"
            startIcon={<DoneIcon />}
            sx={{
              px: 4,
              py: 1,
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            Liquidar
          </Button>
        </DialogActions>
      </Dialog>

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

      {/* Modal de Confirmación */}
      <ConfirmModal
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirmSettled}
        title="Confirmar Cuenta Saldada"
        message="¿Estás seguro de que deseas marcar esta cuenta como saldada?"
      />
    </Container>
  );
};

export default PendingPaymentsClient;
