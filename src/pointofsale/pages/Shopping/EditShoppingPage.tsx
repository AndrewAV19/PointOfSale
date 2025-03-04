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
  Clear as ClearIcon,
} from "@mui/icons-material";
import { ModalSearchProducts } from "../../modales/ModalSearchProducts";
import { products } from "../../mocks/productMock";
import { Product } from "../../interfaces/product.interface";
import { useNavigate } from "react-router-dom";
import { dataStore } from "../../../stores/generalData.store";
import { storeShoppings } from "../../../stores/shopping.store";
import {
  ShoppingProduct,
  ShoppingProductRequest,
  ShoppingRequest,
} from "../../interfaces/shopping.interface";
import ConfirmDialog from "../../../components/ConfirmDeleteModal";

const EditShoppingPage: React.FC = () => {
  const { selectedShopping } = dataStore();
  const { deleteShopping, updateShopping } = storeShoppings();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState(selectedShopping?.supplier?.id);
  const [openModalProducts, setOpenModalProducts] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [amountGiven, setAmountGiven] = useState(selectedShopping?.amount ?? 0);
  const [change, setChange] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "warning"
  >("success");
  const [openDialog, setOpenDialog] = useState(false);
  const [messageSnackbar, setMessageSnackbar] = useState("");
  const [productsList, setProductsList] = useState<ShoppingProduct[]>(
    selectedShopping?.shoppingProducts || []
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [hasChanges, setHasChanges] = useState(false);

  // Función para calcular el total de la compra
  const calculateTotal = () => {
    return productsList.reduce(
      (acc, shoppingProduct) =>
        acc + shoppingProduct.product.costPrice * shoppingProduct.quantity,
      0
    );
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    setQuantity(newQuantity);

    // Recalcular el cambio cuando cambie la cantidad
    if (product) {
      setChange(amountGiven - newQuantity * product.price);
    }
  };

  const handleAmountGivenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let amount = parseFloat(e.target.value);

    if (isNaN(amount)) {
      amount = 0;
    }

    setAmountGiven(amount);
    setChange(amount - calculateTotal());
    setHasChanges(true);
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
                }
              : p
          )
        );
      } else {
        const newShoppingProduct: ShoppingProduct = {
          product,
          quantity,
        };
        setProductsList((prevList) => [...prevList, newShoppingProduct]);
      }

      setProduct(null);
      setQuantity(1);
      setChange(amountGiven - calculateTotal());
      setHasChanges(true);
    } else {
      console.error("No se ha seleccionado ningún producto.");
    }
  };

  const handleDeleteProduct = (productId: number) => {
    setProductsList((prevList) => prevList.filter((p) => p.id !== productId));
    setHasChanges(true);
  };

  const handleReset = () => {
    setSupplier(selectedShopping?.supplier?.id);
    setProduct(null);
    setQuantity(1);
    setAmountGiven(selectedShopping?.amount ?? 0);
    setChange(0);
    setProductsList(selectedShopping?.shoppingProducts ?? []);
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
  const handleIncreaseQuantity = (productId: number) => {
    setProductsList((prevList) =>
      prevList.map((shoppingProduct) =>
        shoppingProduct.product.id === productId
          ? {
              ...shoppingProduct,
              quantity: shoppingProduct.quantity + 1,
            }
          : shoppingProduct
      )
    );
    setHasChanges(true);
  };

  const handleDecreaseQuantity = (productId: number) => {
    setProductsList((prevList) =>
      prevList.map((shoppingProduct) =>
        shoppingProduct.product.id === productId && shoppingProduct.quantity > 1
          ? {
              ...shoppingProduct,
              quantity: shoppingProduct.quantity - 1,
            }
          : shoppingProduct
      )
    );
    setHasChanges(true);
  };

  // Confirmar edición de la compra
  const handleConfirmEdit = async () => {
    if (productsList.length === 0) {
      setSnackbarSeverity("warning");
      handleOpenSnackbar("No hay productos agregados.");
      return;
    }

    try {
      const shoppingProductsRequest: ShoppingProductRequest[] =
        productsList.map((item) => {
          if (!item.product.id) {
            throw new Error("El ID del producto es requerido.");
          }
          return {
            id: item.id,
            product: {
              id: item.product.id,
            },
            quantity: item.quantity,
            sale_id: selectedShopping?.id ?? 0,
          };
        });

      const updatedShoppingData: Partial<ShoppingRequest> = {
        supplier: supplier ? { id: supplier } : undefined,
        shoppingProducts: shoppingProductsRequest,
        amount: amountGiven,
        total: calculateTotal(),
      };

      await updateShopping(selectedShopping?.id ?? 0, updatedShoppingData);

      setSnackbarSeverity("success");
      handleOpenSnackbar("Compra editada exitosamente");

      setHasChanges(false);
    } catch (error) {
      console.error(error);
      setSnackbarSeverity("error");
      handleOpenSnackbar("Error al actualizar la compra");
    }
  };

  // Eliminar la compra
  const handleDeleteClick = () => {
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteShopping(selectedShopping?.id ?? 0);
      navigate(`/compras/historial`);
    } catch (error) {
      console.error("Error al eliminar la compra:", error);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    setChange(amountGiven - calculateTotal());
  }, [productsList, amountGiven]);

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      {/* Botón para regresar */}
      <Box sx={{ marginBottom: 0 }}>
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
                  <TableRow key={product.product.id}>
                    <TableCell>
                      <Avatar
                        alt={product.product.name}
                        src={product.product.images?.[0]}
                      />
                    </TableCell>
                    <TableCell>{product.product.name}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <IconButton
                          onClick={() =>
                            handleDecreaseQuantity(product.product.id!)
                          }
                        >
                          -
                        </IconButton>
                        <Typography variant="body2">
                          {product.quantity}
                        </Typography>
                        <IconButton
                          onClick={() =>
                            handleIncreaseQuantity(product.product.id!)
                          }
                        >
                          +
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell>${product.product.costPrice}</TableCell>{" "}
                    <TableCell>
                      ${product.product.costPrice * product.quantity}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteProduct(product.product.id!)}
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
              value={calculateTotal().toFixed(2)}
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
        </Box>

        {/* Botones*/}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            type="submit"
            onClick={handleConfirmEdit}
            disabled={
              !hasChanges ||
              productsList.length === 0 ||
              amountGiven < calculateTotal()
            }
          >
            Actualizar Compra
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
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
            onClick={handleDeleteClick}
          >
            Eliminar Compra
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<ClearIcon />}
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
      <ConfirmDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que deseas eliminar esta compra?"
      />
    </Container>
  );
};

export default EditShoppingPage;
