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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  AddShoppingCart as AddShoppingCartIcon,
  Clear as ClearIcon,
  LocalAtm as LocalAtmIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { ModalSearchClients } from "../../modales/ModalSearchClients";
import { ModalSearchProducts } from "../../modales/ModalSearchProducts";
import { products } from "../../mocks/productMock";
import { Product } from "../../interfaces/product.interface";
import { SaleRequest } from "../../interfaces/sales.interface";
import { storeSales } from "../../../stores/sales.store";

const CreateSalePage: React.FC = () => {
  const [client, setClient] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openModalProducts, setOpenModalProducts] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [amountGiven, setAmountGiven] = useState(0);
  const [change, setChange] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "warning"
  >("success");
  const [saleStatus, setSaleStatus] = useState<"pendiente" | "pagada">(
    "pagada"
  );
  const [messageSnackbar, setMessageSnackbar] = useState("");
  const [productsList, setProductsList] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const userId = parseInt(localStorage.getItem("id_usuario") ?? "0", 10);

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
    let amount = parseFloat(e.target.value);

    if (isNaN(amount)) {
      amount = 0;
    }

    setAmountGiven(amount);
    setChange(amount - calculateTotal());
  };

  const handleProductIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enteredProductId = e.target.value;
    const selectedProduct = products.find(
      (p) => p.id?.toString() === enteredProductId
    );

    if (selectedProduct) {
      setProduct(selectedProduct);
    } else {
      setProduct(null);
    }
  };

  const handleAddProduct = () => {
    if (product) {
      const existingProduct = productsList.find((p) => p.id === product.id);

      const discountedPrice = product.discount
        ? product.price * (1 - product.discount / 100)
        : product.price;

      if (existingProduct) {
        setProductsList((prevList) =>
          prevList.map((p) =>
            p.id === product.id
              ? {
                  ...p,
                  quantity: p.quantity + quantity,
                  total: (p.quantity + quantity) * discountedPrice,
                }
              : p
          )
        );
      } else {
        const newProduct = {
          id: product.id,
          name: product.name,
          quantity,
          price: product.price,
          discountedPrice, // Precio con descuento
          total: discountedPrice * quantity,
          image: product.image,
          discount: product.discount, // Guardar el descuento
        };
        setProductsList((prevList) => [...prevList, newProduct]);
      }

      setProduct(null);
      setQuantity(1);
      setChange(amountGiven - calculateTotal());
    } else {
      console.error("No se ha seleccionado ningún producto.");
    }
  };

  const handleDeleteProduct = (productId: string) => {
    setProductsList((prevList) => prevList.filter((p) => p.id !== productId));
  };

  const handleReset = () => {
    setClient("");
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

  // Confirmar venta
  const handleConfirmSale = async () => {
    if (productsList.length === 0) {
      setSnackbarSeverity("warning");
      handleOpenSnackbar("No hay productos agregados.");
      return;
    }

    try {
      const saleData: SaleRequest = {
        client: client ? { id: parseInt(client, 10) } : undefined,
        saleProducts: productsList.map((product) => ({
          product: { id: product.id },
          quantity: product.quantity,
        })),
        amount: amountGiven,
        state: saleStatus,
        total: calculateTotal(),
        user: { id: userId },
      };

      await storeSales.getState().createSale(saleData);

      setSnackbarSeverity("success");
      handleOpenSnackbar("Venta creada exitosamente");

      // Reiniciar el formulario
      handleReset();
    } catch (error) {
      console.error(error);
      setSnackbarSeverity("error");
      handleOpenSnackbar("Error al crear la venta");
    }
  };

  useEffect(() => {
    setChange(amountGiven - calculateTotal());
  }, [productsList, amountGiven]);

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Crear Venta
      </Typography>
      <Paper sx={{ padding: 3, borderRadius: 2 }}>
        <Box display="flex" flexDirection="column" gap={3}>
          {/* Selección de Cliente */}
          <Box display="flex" gap={3}>
            <Box flex={1}>
              <TextField
                label="Código cliente"
                fullWidth
                value={client}
                onChange={(e) => setClient(e.target.value)}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setOpenModal(true)}>
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              {/* Modal para seleccionar cliente */}
              <ModalSearchClients
                open={openModal}
                handleClose={() => setOpenModal(false)}
                handleSelect={(selectedClient) => setClient(selectedClient.id)}
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
                showPrice={true}
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

          <Box display="flex" gap={3}>
            <Box flex={1}>
              <FormControl fullWidth>
                <InputLabel>Estado de la venta</InputLabel>
                <Select
                  value={saleStatus}
                  onChange={(e) =>
                    setSaleStatus(e.target.value as "pendiente" | "pagada")
                  }
                  label="Estado de la venta"
                >
                  <MenuItem value="pendiente">Pendiente</MenuItem>
                  <MenuItem value="pagada">Pagada</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Cambio */}
            <Box flex={1}>
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
                <TableCell>Imagen</TableCell>
                <TableCell>Producto</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Precio Unitario</TableCell>
                <TableCell>Descuento</TableCell>
                <TableCell>Precio con Descuento</TableCell>
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
                    <TableCell>${product.price}</TableCell>
                    <TableCell>
                      {product.discount ? `${product.discount}%` : "N/A"}
                    </TableCell>
                    <TableCell>
                      $
                      {product.discountedPrice
                        ? product.discountedPrice.toFixed(2)
                        : product.price.toFixed(2)}
                    </TableCell>
                    <TableCell>${product.total.toFixed(2)}</TableCell>
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
              value={calculateTotal()}
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
              }}
              startIcon={<LocalAtmIcon />}
              fullWidth
              onClick={() => {
                handleConfirmSale();
                handleReset();
              }}
              disabled={
                saleStatus === "pagada"
                  ? productsList.length === 0 || amountGiven < calculateTotal()
                  : productsList.length === 0
              }
            >
              Confirmar Venta
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<ClearIcon />}
              fullWidth
              onClick={handleReset}
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

export default CreateSalePage;
