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
  SelectChangeEvent,
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

import { useNavigate } from "react-router-dom";
import { dataStore } from "../../../stores/generalData.store";
import { storeSales } from "../../../stores/sales.store";
import { Product } from "../../interfaces/product.interface";
import {
  SaleProduct,
  SaleProductRequest,
  SaleRequest,
} from "../../interfaces/sales.interface";
import ConfirmCancelDialog from "../../../components/ConfirmCancelModal";
type SaleStatus = "pendiente" | "pagada" | "cancelada";

const EditSalePage: React.FC = () => {
  const { selectedSale } = dataStore();
  const { cancelSale, updateSale } = storeSales();
  const navigate = useNavigate();
  const [client, setClient] = useState(selectedSale?.client?.id);
  const [openModalProducts, setOpenModalProducts] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [amountGiven, setAmountGiven] = useState(selectedSale?.amount ?? 0);
  const [change, setChange] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "warning"
  >("success");
  const getInitialSaleStatus = (state?: string): SaleStatus => {
    if (state === "pendiente") return "pendiente";
    if (state === "pagada") return "pagada";
    return "cancelada";
  };

  const [saleStatus, setSaleStatus] = useState<SaleStatus>(
    getInitialSaleStatus(selectedSale?.state)
  );

  const [openDialog, setOpenDialog] = useState(false);
  const [messageSnackbar, setMessageSnackbar] = useState("");
  const [productsList, setProductsList] = useState<SaleProduct[]>(
    selectedSale?.saleProducts || []
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [hasChanges, setHasChanges] = useState(false);

  const isDisabled = saleStatus === "cancelada";

  // Función para calcular el total de la venta
  const calculateTotal = () => {
    return productsList.reduce((acc, saleProduct) => {
      const discountedPrice = saleProduct.product.discount
        ? saleProduct.product.price * (1 - saleProduct.product.discount / 100)
        : saleProduct.product.price;
      return acc + discountedPrice * saleProduct.quantity;
    }, 0);
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
        const existingProduct = productsList.find(
            (p) => p.product.id === product.id
        );

        if (existingProduct) {
            // Si el producto ya existe, actualiza su cantidad
            setProductsList((prevList) =>
                prevList.map((p) =>
                    p.product.id === product.id
                        ? {
                              ...p,
                              quantity: p.quantity + quantity,
                          }
                        : p
                )
            );
        } else {
            // Si el producto no existe, agrégalo a la lista
            const newSaleProduct: SaleProduct = {
                product: {
                    ...product,
                },
                quantity,
                discount: product.discount, // Incluye el descuento
            };
            setProductsList((prevList) => [...prevList, newSaleProduct]);
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
    setProductsList((prevList) =>
      prevList.filter((p) => p.product.id !== productId)
    );
    setHasChanges(true);
  };

  const handleReset = () => {
    setClient(selectedSale?.client?.id);
    setProduct(null);
    setQuantity(1);
    setAmountGiven(selectedSale?.amount ?? 0);
    setChange(0);
    setProductsList(selectedSale?.saleProducts ?? []);
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
      prevList.map((saleProduct) =>
        saleProduct.product.id === productId
          ? {
              ...saleProduct,
              quantity: saleProduct.quantity + 1,
            }
          : saleProduct
      )
    );
    setHasChanges(true);
  };

  const handleDecreaseQuantity = (productId: number) => {
    setProductsList((prevList) =>
      prevList.map((saleProduct) =>
        saleProduct.product.id === productId && saleProduct.quantity > 1
          ? {
              ...saleProduct,
              quantity: saleProduct.quantity - 1,
            }
          : saleProduct
      )
    );
    setHasChanges(true);
  };

  const handleSaleStatusChange = (
    event: SelectChangeEvent<"pendiente" | "pagada" | "cancelada">
  ) => {
    setSaleStatus(event.target.value as "pendiente" | "pagada" | "cancelada");
    setHasChanges(true);
  };

  // Confirmar edición de la venta
  const handleConfirmEdit = async () => {
    if (productsList.length === 0) {
      setSnackbarSeverity("warning");
      handleOpenSnackbar("No hay productos agregados.");
      return;
    }

    try {
      const saleProductsRequest: SaleProductRequest[] = productsList.map(
        (item) => {
          if (!item.product.id) {
            throw new Error("El ID del producto es requerido.");
          }
          return {
            id: item.id,
            product: {
              id: item.product.id,
            },
            quantity: item.quantity,
            sale_id: selectedSale?.id ?? 0,
          };
        }
      );

      const updatedSaleData: Partial<SaleRequest> = {
        client: client ? { id: client } : undefined,
        saleProducts: saleProductsRequest,
        amount: amountGiven,
        state: saleStatus,
        total: calculateTotal(),
      };

      await updateSale(selectedSale?.id ?? 0, updatedSaleData);

      setSnackbarSeverity("success");
      handleOpenSnackbar("Venta editada exitosamente");

      setHasChanges(false);
    } catch (error) {
      console.error(error);
      setSnackbarSeverity("error");
      handleOpenSnackbar("Error al actualizar la venta");
    }
  };

  // Eliminar la venta
  const handleDeleteClick = () => {
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await cancelSale(selectedSale?.id ?? 0);
      navigate(`/ventas/historial`);
    } catch (error) {
      console.error("Error al eliminar la venta:", error);
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
        Editar Venta
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
                disabled={isDisabled}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton disabled={isDisabled}>
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
                disabled={isDisabled}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setOpenModalProducts(true)}
                          disabled={isDisabled}
                        >
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
                disabled={isDisabled}
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
                disabled={isDisabled}
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
          <Box display="flex" gap={3}>
            <Box flex={1}>
              <FormControl fullWidth>
                <InputLabel>Estado de la venta</InputLabel>
                <Select
                  value={saleStatus}
                  onChange={handleSaleStatusChange}
                  label="Estado de la venta"
                  disabled={isDisabled}
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
              disabled={isDisabled}
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
                .map((saleProduct) => {
                    const discountedPrice = saleProduct.discount
                        ? saleProduct.product.price * (1 - saleProduct.discount / 100)
                        : saleProduct.product.price;

                    return (
                        <TableRow key={saleProduct.product.id}>
                            <TableCell>
                                <Avatar
                                    alt={saleProduct.product.name}
                                    src={saleProduct.product.image}
                                />
                            </TableCell>
                            <TableCell>{saleProduct.product.name}</TableCell>
                            <TableCell>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <IconButton
                                        onClick={() =>
                                            handleDecreaseQuantity(saleProduct.product.id!)
                                        }
                                        disabled={isDisabled}
                                    >
                                        -
                                    </IconButton>
                                    <Typography variant="body2">
                                        {saleProduct.quantity}
                                    </Typography>
                                    <IconButton
                                        onClick={() =>
                                            handleIncreaseQuantity(saleProduct.product.id!)
                                        }
                                        disabled={isDisabled}
                                    >
                                        +
                                    </IconButton>
                                </Box>
                            </TableCell>
                            <TableCell>${saleProduct.product.price.toFixed(2)}</TableCell>
                            <TableCell>
                                {saleProduct.discount ? `${saleProduct.discount}%` : "N/A"}
                            </TableCell>
                            <TableCell>${discountedPrice.toFixed(2)}</TableCell>
                            <TableCell>
                                ${(discountedPrice * saleProduct.quantity).toFixed(2)}
                            </TableCell>
                            <TableCell>
                                <IconButton
                                    color="error"
                                    onClick={() =>
                                        handleDeleteProduct(saleProduct.product.id!)
                                    }
                                    disabled={isDisabled}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    );
                })}
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

        {/* Total*/}
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
              isDisabled ||
              (saleStatus === "pagada"
                ? productsList.length === 0 ||
                  amountGiven <= 0 ||
                  amountGiven < calculateTotal() ||
                  !hasChanges
                : productsList.length === 0 || !hasChanges)
            }
          >
            Actualizar Venta
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
            disabled={isDisabled}
          >
            Cancelar Venta
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
            disabled={isDisabled}
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
      <ConfirmCancelDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar Cancelación"
        message="¿Estás seguro de que deseas cancelar esta venta?"
      />
    </Container>
  );
};

export default EditSalePage;
