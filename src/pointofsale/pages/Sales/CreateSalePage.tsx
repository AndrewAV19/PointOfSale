import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  TextField,
  MenuItem,
  Button,
  Typography,
  Paper,
  Box,
  Select,
  InputLabel,
  FormControl,
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
} from "@mui/icons-material";

const CreateSalePage: React.FC = () => {
  const [client, setClient] = useState("");
  const [product, setProduct] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [amountGiven, setAmountGiven] = useState(0);
  const [change, setChange] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [messageSnackbar, setMessageSnackbar] = useState("");
  const [productsList, setProductsList] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const clients = ["Cliente 1", "Cliente 2", "Cliente 3"];
  const availableProducts = [
    { id: "1", name: "Sabritas", price: 100, image: "/path/to/sabritas.jpg" },
    { id: "2", name: "Coca Cola", price: 50, image: "/path/to/coca_cola.jpg" },
    { id: "3", name: "Doritos", price: 120, image: "/path/to/doritos.jpg" },
    { id: "4", name: "Galletas Oreo", price: 80, image: "/path/to/oreo.jpg" },
    // Puedes agregar más productos aquí
  ];

  // Función para calcular el total de la venta
  const calculateTotal = () => {
    return productsList.reduce((acc, product) => acc + product.total, 0);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    setQuantity(newQuantity);

    // Recalcular el cambio cuando cambie la cantidad
    const selectedProduct = availableProducts.find((p) => p.name === product);
    if (selectedProduct) {
      setChange(amountGiven - newQuantity * selectedProduct.price);
    }
  };

  const handleAmountGivenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(e.target.value);
    setAmountGiven(amount);
    setChange(amount - calculateTotal());
  };
  // Asegúrate de que handleProductIdChange también actualice el cambio
  const handleProductIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enteredProductId = e.target.value;
    setProductId(enteredProductId);

    // Buscar el producto seleccionado por ID
    const selectedProduct = availableProducts.find(
      (p) => p.id === enteredProductId
    );
    if (selectedProduct) {
      // Recalcular el cambio con el nuevo producto
      setChange(amountGiven - quantity * selectedProduct.price);
    }
  };

  const handleAddProduct = () => {
    const selectedProduct = availableProducts.find((p) => p.id === productId);
    if (selectedProduct) {
      const newProduct = {
        id: selectedProduct.id,
        name: selectedProduct.name,
        quantity,
        price: selectedProduct.price,
        total: selectedProduct.price * quantity,
        image: selectedProduct.image,
      };
      setProductsList((prevList) => [...prevList, newProduct]);
      setProductId("");
      setQuantity(1);
      setChange(amountGiven - (calculateTotal() + newProduct.total));
    }
  };

  const handleDeleteProduct = (productId: string) => {
    setProductsList((prevList) => prevList.filter((p) => p.id !== productId));
  };

  const handleReset = () => {
    setClient("");
    setProductId("");
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
    event: React.MouseEvent<HTMLButtonElement> | null,
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

  useEffect(() => {
    setChange(amountGiven - calculateTotal());
  }, [productsList, amountGiven]);

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Crear Venta
      </Typography>
      <Paper sx={{ padding: 3, borderRadius: 2 }}>
        <Grid container spacing={3}>
          {/* Selección de Cliente */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Cliente</InputLabel>
              <Select
                value={client}
                onChange={(e) => setClient(e.target.value)}
                label="Cliente"
              >
                {clients.map((clientName) => (
                  <MenuItem key={clientName} value={clientName}>
                    {clientName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Producto */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="ID del Producto"
              fullWidth
              value={productId}
              onChange={handleProductIdChange}
              error={!!availableProducts.find((p) => p.id === productId)}
              helperText={
                availableProducts.find((p) => p.id === productId)
                  ? ""
                  : "ID inválido"
              }
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
              onClick={() => handleOpenSnackbar("Venta Confirmada")}
            >
              Confirmar Venta
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

      {/* Snackbar de confirmación */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {messageSnackbar}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateSalePage;
