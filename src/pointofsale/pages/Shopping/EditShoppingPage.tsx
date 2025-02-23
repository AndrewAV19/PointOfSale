import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  InputAdornment,
  Divider,
  IconButton,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Avatar,
} from "@mui/material";
import {
  AddShoppingCart as AddShoppingCartIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { ModalSearchProducts } from "../../modales/ModalSearchProducts";
import { products } from "../../mocks/productMock";
import { Product } from "../../interfaces/product.interface";
import { mockPurchase } from "../../mocks/shoppingMock";
import { useLocation, useNavigate } from "react-router-dom";

const EditShoppingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [supplier, setSupplier] = useState(mockPurchase.supplier.id);
  const [openModalProducts, setOpenModalProducts] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [amountGiven, setAmountGiven] = useState(mockPurchase.amountGiven);
  const [change, setChange] = useState(0);
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "warning"
  >("success");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [messageSnackbar, setMessageSnackbar] = useState("");
  const [productsList, setProductsList] = useState<any[]>(mockPurchase.products);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Verifica si el mensaje debe aparecer luego de la navegación
    if (location.pathname === "/compras/historial" && messageSnackbar) {
      setOpenSnackbar(true);
    }
  }, [location, messageSnackbar]);

  // Función para calcular el total de la compra
  const calculateTotal = () => {
    return productsList.reduce((acc, product) => acc + product.total, 0);
  };

  // Calcular el cambio automáticamente
  useEffect(() => {
    const total = calculateTotal();
    setChange(amountGiven - total);
  }, [amountGiven, productsList]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    setQuantity(newQuantity);
  };

  const handleAmountGivenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(e.target.value);
    setAmountGiven(amount);
  };

  const handleProductIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enteredProductId = e.target.value;
    const selectedProduct = products.find(
      (p) => p.id.toString() === enteredProductId
    );

    if (selectedProduct) {
      setProduct(selectedProduct);
    } else {
      setProduct(null);
    }
  };

  const handleAddProduct = () => {
    if (product) {
      // Verifica si el producto ya existe en la lista
      const existingProduct = productsList.find((p) => p.id === product.id);

      if (existingProduct) {
        // Si el producto ya existe, actualiza su cantidad y total
        setProductsList((prevList) =>
          prevList.map((p) =>
            p.id === product.id
              ? {
                  ...p,
                  quantity: p.quantity + quantity,
                  total: (p.quantity + quantity) * p.costPrice,
                }
              : p
          )
        );
      } else {
        const newProduct = {
          id: product.id,
          name: product.name,
          quantity,
          costPrice: product.costPrice,
          total: product.costPrice * quantity,
        };
        setProductsList((prevList) => [...prevList, newProduct]);
      }

      setProduct(null);
      setQuantity(1);
      setHasChanges(true);
    } else {
      console.error("No se ha seleccionado ningún producto.");
    }
  };

  const handleDeleteProduct = (productId: string) => {
    setProductsList((prevList) => prevList.filter((p) => p.id !== productId));
    setHasChanges(true);
  };

  const handleReset = () => {
    setSupplier(mockPurchase.supplier.id);
    setProduct(null);
    setQuantity(1);
    setAmountGiven(mockPurchase.amountGiven);
    setProductsList(mockPurchase.products);
  };

  const handleOpenSnackbar = (message: string) => {
    setMessageSnackbar(message);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleChangePage = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Función para aumentar la cantidad
  const handleIncreaseQuantity = (productId: string) => {
    setProductsList((prevList) =>
      prevList.map((product) =>
        product.id === productId
          ? {
              ...product,
              quantity: product.quantity + 1,
              total: (product.quantity + 1) * product.costPrice,
            }
          : product
      )
    );
    setHasChanges(true);
  };

  const handleDecreaseQuantity = (productId: string) => {
    setProductsList((prevList) =>
      prevList.map((product) =>
        product.id === productId && product.quantity > 1
          ? {
              ...product,
              quantity: product.quantity - 1,
              total: (product.quantity - 1) * product.costPrice,
            }
          : product
      )
    );
    setHasChanges(true);
  };

  // Confirmar edición de la compra
  const handleConfirmEdit = () => {
    if (amountGiven < calculateTotal()) {
      setSnackbarSeverity("error");
      handleOpenSnackbar("Dinero insuficiente.");
      return;
    }

    if (productsList.length === 0) {
      setSnackbarSeverity("warning");
      handleOpenSnackbar("No hay productos agregados.");
      return;
    }

    setSnackbarSeverity("success");
    handleOpenSnackbar("Compra Editada Correctamente");
  };

  // Eliminar la compra
  const handleDeletePurchase = () => {
    navigate(`/compras/historial`)
    setSnackbarSeverity("success");
    handleOpenSnackbar("Compra Eliminada Correctamente");
    handleReset();
  };

  const handleGoBack = () => {
    navigate(-1); 
  };


  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
        {/* Botón para regresar */}
             <Box sx={{ marginBottom: 0}}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={handleGoBack}
              >
                Regresar
              </Button>
            </Box>
      <Typography variant="h4" align="center" gutterBottom>
        Editar Compra
      </Typography>
      <Paper sx={{ padding: 3, borderRadius: 2 }}>
        <Box display="flex" flexDirection="column" gap={3}>
          {/* Selección de Proveedor y Producto */}
          <Box display="flex" gap={3}>
            {/* Selección de Proveedor */}
            <Box flex={1}>
              <TextField
                label="Código proveedor"
                fullWidth
                value={supplier}
                disabled
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton>
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            {/* Producto */}
            <Box flex={1}>
              <TextField
                label="Código producto"
                fullWidth
                value={product ? product.id : ""}
                onChange={handleProductIdChange}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setOpenModalProducts(true)}>
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              {/* Modal para seleccionar producto */}
              <ModalSearchProducts
                open={openModalProducts}
                handleClose={() => setOpenModalProducts(false)}
                handleSelect={(selectedProduct) => setProduct(selectedProduct)}
                showPrice={false}
              />
            </Box>
          </Box>

          {/* Cantidad y Monto dado */}
          <Box display="flex" gap={3}>
            <Box flex={1}>
              <TextField
                label="Cantidad"
                type="number"
                fullWidth
                value={quantity}
                onChange={handleQuantityChange}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">#</InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            <Box flex={1}>
              <TextField
                label="Monto Dado"
                type="number"
                fullWidth
                value={amountGiven}
                onChange={handleAmountGivenChange}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  },
                }}
              />
            </Box>
          </Box>

          {/* Cambio */}
          <Box>
            <TextField
              label="Cambio"
              value={change.toFixed(2)} // Mostrar el cambio con 2 decimales
              disabled
              sx={{
                "& .MuiInputBase-root": {
                  backgroundColor:
                    change < 0 ? "rgba(255, 0, 0, 0.1)" : "inherit",
                },
                "& .MuiInputBase-input": {
                  color: change < 0 ? "red" : "inherit",
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          {/* Botón para agregar el producto */}
          <Box display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              sx={{
                width: "auto",
              }}
              startIcon={<AddShoppingCartIcon />}
              onClick={handleAddProduct}
            >
              Agregar Producto
            </Button>
          </Box>
        </Box>

        <Divider sx={{ marginY: 3 }} />

        {/* Tabla de productos seleccionados */}
        <Typography variant="h6" gutterBottom>
          Productos Seleccionados
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Producto</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Precio Unitario</TableCell>
                <TableCell>Total</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productsList
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Avatar alt={product.name} src={product.image} />
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <IconButton
                          onClick={() => handleDecreaseQuantity(product.id)}
                        >
                          -
                        </IconButton>
                        <Typography variant="body2">
                          {product.quantity}
                        </Typography>
                        <IconButton
                          onClick={() => handleIncreaseQuantity(product.id)}
                        >
                          +
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell>${product.costPrice}</TableCell>{" "}
                    <TableCell>${product.total}</TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={productsList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>

        <Divider sx={{ marginY: 3 }} />

        {/* Total y Botones */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "flex-end",
          }}
        >
          <Box>
            <TextField
              label="Total"
              value={calculateTotal().toFixed(2)} // Mostrar el total con 2 decimales
              fullWidth
              disabled
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
            gap={2}
            sx={{ marginTop: 3 }}
          >
            <Button
              variant="contained"
              sx={{
                backgroundColor: "green",
                "&:hover": { backgroundColor: "darkgreen" },
                color: "white",
                fontWeight: "bold",
                textTransform: "none",
                boxShadow: 2,
                padding: "10px 20px",
                borderRadius: "8px",
                transition: "background-color 0.3s ease",
              }}
              startIcon={<SaveIcon />}
              fullWidth
              onClick={handleConfirmEdit}
              disabled={
                !hasChanges ||
                productsList.length === 0 || 
                amountGiven < calculateTotal() 
              }
            >
              Confirmar Edición
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "error.main",
                "&:hover": { backgroundColor: "darkred" },
                color: "white",
                fontWeight: "bold",
                textTransform: "none",
                boxShadow: 2,
                padding: "10px 20px",
                borderRadius: "8px",
                transition: "background-color 0.3s ease",
              }}
              color="error"
              startIcon={<DeleteIcon />}
              fullWidth
              onClick={handleDeletePurchase}
            >
              Eliminar Compra
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Snackbar de confirmación y errores */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{
            width: "100%",
            fontSize: "1.0rem",
            padding: "16px",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          {messageSnackbar}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EditShoppingPage;