import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
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
  Clear as ClearIcon,
  LocalAtm as LocalAtmIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { ModalSearchSuppliers } from "../../modales/ModalSearchSuppliers";
import { Product } from "../../interfaces/product.interface";
import { products } from "../../mocks/productMock";
import { ModalSearchProducts } from "../../modales/ModalSearchProducts";

const CreateShoppingPage: React.FC = () => {
  const [supplier, setSupplier] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openModalProducts, setOpenModalProducts] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [amountGiven, setAmountGiven] = useState(0);
  const [change, setChange] = useState(0);
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "warning"
  >("success");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [messageSnackbar, setMessageSnackbar] = useState("");
  const [productsList, setProductsList] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  console.log(setProduct);

  // Función para calcular el total de la venta
  const calculateTotal = () => {
    return productsList.reduce((acc, product) => acc + product.total, 0);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    setQuantity(newQuantity);

    // Recalcular el cambio cuando cambie la cantidad
    const selectedProduct = products.find((p) => p.name === product?.name);
    if (selectedProduct) {
      setChange(amountGiven - newQuantity * selectedProduct.price);
    }
  };

  const handleAmountGivenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(e.target.value);
    setAmountGiven(amount);
    setChange(amount - calculateTotal());
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
      const newProduct = {
        id: product.id,
        name: product.name,
        quantity,
        price: product.price,
        total: product.price * quantity,
      };

      // Agrega el nuevo producto a la lista
      setProductsList((prevList) => [...prevList, newProduct]);

      setProduct(null);
      setQuantity(1);
      setChange(amountGiven - (calculateTotal() + newProduct.total));
    } else {
      console.error("No se ha seleccionado ningún producto.");
    }
  };

  const handleDeleteProduct = (productId: string) => {
    setProductsList((prevList) => prevList.filter((p) => p.id !== productId));
  };

  const handleReset = () => {
    setSupplier("");
    setProduct(null);
    setQuantity(1);
    setAmountGiven(0);
    setChange(0);
    setProductsList([]);
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
              total: (product.quantity + 1) * product.price,
            }
          : product
      )
    );
  };

  const handleDecreaseQuantity = (productId: string) => {
    setProductsList((prevList) =>
      prevList.map((product) =>
        product.id === productId && product.quantity > 1
          ? {
              ...product,
              quantity: product.quantity - 1,
              total: (product.quantity - 1) * product.price,
            }
          : product
      )
    );
  };

  const handleConfirmPurchase = () => {
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
    handleOpenSnackbar("Compra Confirmada");
  };

  useEffect(() => {
    setChange(amountGiven - calculateTotal());
  }, [productsList, amountGiven]);

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Crear Compra
      </Typography>
      <Paper sx={{ padding: 3, borderRadius: 2 }}>
        <Grid container spacing={3}>
          {/* Selección de Proveedor */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Código proveedor"
              fullWidth
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setOpenModal(true)}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Modal para seleccionar proveedor */}
            <ModalSearchSuppliers
              open={openModal}
              handleClose={() => setOpenModal(false)}
              handleSelect={(selectedSupplier) =>
                setSupplier(selectedSupplier.id)
              }
            />
          </Grid>

          {/* Producto */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Código producto"
              fullWidth
              value={product ? product.id : ""}
              onChange={handleProductIdChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setOpenModalProducts(true)}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {/* Modal para seleccionar producto */}
            <ModalSearchProducts
              open={openModalProducts}
              handleClose={() => setOpenModalProducts(false)}
              handleSelect={(selectedProduct) => setProduct(selectedProduct)}
            />
          </Grid>

          {/* Cantidad */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Cantidad"
              type="number"
              fullWidth
              value={quantity}
              onChange={handleQuantityChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">#</InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Monto dado */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Monto Dado"
              type="number"
              fullWidth
              value={amountGiven}
              onChange={handleAmountGivenChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Cambio */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Cambio"
              value={change}
              fullWidth
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Botón para agregar el producto */}
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
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
          </Grid>
        </Grid>

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
                <TableCell>Precio Unitario</TableCell> {/* Nueva columna */}
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
                    <TableCell>${product.price}</TableCell>{" "}
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
          <Grid
            item
            xs={12}
            sx={{ display: "flex", justifyContent: "flex-start" }}
          >
            <TextField
              label="Total"
              value={calculateTotal()}
              fullWidth
              disabled
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
            />
          </Grid>

          <Box
            display="flex"
            justifyContent="space-between"
            gap={2}
            sx={{ marginTop: 3 }}
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<LocalAtmIcon />}
              fullWidth
              onClick={handleConfirmPurchase}
            >
              Confirmar Compra
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<ClearIcon />}
              fullWidth
              onClick={handleReset}
            >
              Limpiar Campos
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

export default CreateShoppingPage;
