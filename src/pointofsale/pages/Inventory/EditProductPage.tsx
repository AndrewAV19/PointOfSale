import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Box,
  Typography,
  Paper,
  FormControlLabel,
  Switch,
  Avatar,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Save as SaveIcon,
  AddPhotoAlternate as AddPhotoIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  QrCode as QrCodeIcon,
} from "@mui/icons-material";
import { ModalSearchCategories } from "../../modales/ModalSearchCategories";
import { Supplier } from "../../interfaces/supplier.interface";
import { ModalSearchSuppliers } from "../../modales/ModalSearchSuppliers";
import { storeProducts } from "../../../stores/products.store";
import { dataStore } from "../../../stores/generalData.store";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../../../components/ConfirmDeleteModal";

const EditProductPage: React.FC = () => {
  const { selectedProduct } = dataStore();
  const { deleteProduct } = storeProducts();
  const [product, setProduct] = useState({
    barCode: selectedProduct?.barCode ?? "",
    name: selectedProduct?.name ?? "",
    description: selectedProduct?.description ?? "",
    price: selectedProduct?.price ?? 0,
    costPrice: selectedProduct?.costPrice ?? 0,
    stock: selectedProduct?.stock ?? 0,
    categoryId: selectedProduct?.category?.id ?? 0,
    discount: !!selectedProduct?.discount,
    discountPercentage: selectedProduct?.discount ?? 0,
    photo: null as File | null,
    suppliers: selectedProduct?.suppliers || ([] as Supplier[]),
  });
  const [category, setCategory] = useState(
    selectedProduct?.category?.id?.toString() ?? ""
  );
  const [preview, setPreview] = useState(selectedProduct?.image ?? "");
  const [openModal, setOpenModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSupplierModal, setOpenSupplierModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "warning"
  >("success");
  const [messageSnackbar, setMessageSnackbar] = useState("");
  const navigate = useNavigate();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [openPdfModal, setOpenPdfModal] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;

    // Validar que el valor sea un número para los campos de precio y stock
    if (name === "price" || name === "stock") {
      const numericValue = parseFloat(value as string);
      if (isNaN(numericValue)) {
        return;
      }
    }

    setProduct((prevProduct) => ({
      ...prevProduct,
      [name as string]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setProduct((prevProduct) => ({
        ...prevProduct,
        photo: file,
      }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSelectSupplier = (selectedSupplier: Supplier) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      suppliers: [...prevProduct.suppliers, selectedSupplier],
    }));
    setOpenSupplierModal(false);
  };

  const handleReset = () => {
    setProduct({
      barCode: selectedProduct?.barCode ?? "",
      name: selectedProduct?.name ?? "",
      description: selectedProduct?.description ?? "",
      price: selectedProduct?.price ?? 0,
      costPrice: selectedProduct?.costPrice ?? 0,
      stock: selectedProduct?.stock ?? 0,
      categoryId: selectedProduct?.category?.id ?? 0,
      discount: !!selectedProduct?.discount,
      discountPercentage: selectedProduct?.discount ?? 0,
      photo: null as File | null,
      suppliers: selectedProduct?.suppliers || ([] as Supplier[]),
    });
    setCategory(selectedProduct?.category?.id?.toString() ?? "");
    setPreview("");
  };

  const handleOpenSnackbar = (message: string) => {
    setMessageSnackbar(message);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => {
        reject(new Error("Error al leer el archivo: " + error.type));
      };
    });
  };

  const handleConfirmSale = async () => {
    if (
      !product.name ||
      product.price === undefined ||
      product.stock === undefined
    ) {
      setSnackbarSeverity("error");
      handleOpenSnackbar("Todos los campos obligatorios deben ser llenados.");
      return;
    }

    if (product.price === 0) {
      setSnackbarSeverity("error");
      handleOpenSnackbar("El precio no puede ser 0.");
      return;
    }

    const priceRegex = /^\d+(\.\d{1,2})?$/;
    const stockRegex = /^\d+$/;

    if (!priceRegex.test(product.price.toString())) {
      setSnackbarSeverity("error");
      handleOpenSnackbar("El precio solo puede contener números.");
      return;
    }

    if (!stockRegex.test(product.stock.toString())) {
      setSnackbarSeverity("error");
      handleOpenSnackbar("El stock solo puede contener números.");
      return;
    }

    try {
      const validSuppliers = product.suppliers
        .filter((supplier) => supplier.id !== undefined)
        .map((supplier) => ({ id: supplier.id as number }));

      const categoryIdAsNumber = !isNaN(Number(category))
        ? Number(category)
        : 0;

      const imageBase64 = product.photo
        ? await convertImageToBase64(product.photo)
        : selectedProduct?.image ?? "";

      // Actualizar el producto usando el store
      await storeProducts.getState().updateProduct(selectedProduct?.id ?? 0, {
        barCode: product.barCode,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: { id: categoryIdAsNumber },
        suppliers: validSuppliers,
        costPrice: product.costPrice,
        discount: product.discount ? product.discountPercentage : undefined,
        taxRate: 0,
        image: imageBase64,
      });

      // Mostrar mensaje de éxito
      setSnackbarSeverity("success");
      handleOpenSnackbar("Producto actualizado correctamente.");
    } catch (error) {
      // Mostrar mensaje de error
      setSnackbarSeverity("error");
      handleOpenSnackbar("Error al actualizar el producto.");
      console.error(error);
    }
  };

  const handleRemoveSupplier = (supplierId: number) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      suppliers: prevProduct.suppliers.filter(
        (supplier) => supplier.id !== supplierId
      ),
    }));
  };

  const handleDeleteClick = () => {
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteProduct(selectedProduct?.id ?? 0);
      navigate(`/inventario/productos/historial`);
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGenerateQrCode = async () => {
    try {
      if (!selectedProduct?.id) {
        setSnackbarSeverity("error");
        handleOpenSnackbar("No se ha seleccionado un producto válido.");
        return;
      }

      // Generar el código QR
      await storeProducts.getState().generateQrCode(selectedProduct.id);

      // Generar la etiqueta del producto
      const blob = await storeProducts
        .getState()
        .generateProductLabel(selectedProduct.id);

      const pdfUrl = URL.createObjectURL(blob);
      setPdfUrl(pdfUrl);
      setOpenPdfModal(true);

      setSnackbarSeverity("success");
    } catch (error) {
      setSnackbarSeverity("error");
      handleOpenSnackbar("Error al generar el código QR y la etiqueta.");
      console.error(error);
    }
  };

  const handleClosePdfModal = () => {
    setOpenPdfModal(false);
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  };

  return (
    <Container className="py-8">
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
      <Paper elevation={3} className="p-6">
        <Typography
          variant="h4"
          component="h1"
          className="mb-6 text-center font-bold"
        >
          Editar Producto
        </Typography>

        {/* Foto del Producto */}
        <Box className="flex justify-center mb-6">
          <label htmlFor="photo-upload">
            <Avatar
              src={preview ?? undefined}
              sx={{ width: 150, height: 150, cursor: "pointer" }}
              className="border-2 border-gray-300 hover:border-blue-500"
            >
              <AddPhotoIcon fontSize="large" />
            </Avatar>
          </label>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </Box>

        {/* Código de barras */}
        <Box className="mb-6">
          <TextField
            fullWidth
            label="Código de barras"
            name="barCode"
            value={product.barCode}
            onChange={handleChange}
            variant="outlined"
          />
        </Box>

        {/* Nombre del Producto */}
        <Box className="mb-6">
          <TextField
            fullWidth
            label="Nombre del Producto"
            name="name"
            value={product.name}
            onChange={handleChange}
            variant="outlined"
            required
          />
        </Box>

        {/* Descripción */}
        <Box className="mb-6">
          <TextField
            fullWidth
            label="Descripción"
            name="description"
            value={product.description}
            onChange={handleChange}
            variant="outlined"
            multiline
            rows={4}
          />
        </Box>

        <Box className="mb-6">
          <TextField
            label="Proveedores"
            fullWidth
            value={product.suppliers
              .map((supplier) => supplier.name)
              .join(", ")}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setOpenSupplierModal(true)}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        <ModalSearchSuppliers
          open={openSupplierModal}
          handleClose={() => setOpenSupplierModal(false)}
          handleSelect={handleSelectSupplier}
        />

        <Box className="mb-6">
          <Typography variant="h6" className="mb-2">
            Proveedores seleccionados
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Telefono</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {product.suppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell>{supplier.id}</TableCell>
                    <TableCell>{supplier.name}</TableCell>
                    <TableCell>{supplier.email}</TableCell>
                    <TableCell>{supplier.phone}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleRemoveSupplier(supplier.id ?? 0)}
                        color="error"
                      >
                        <ClearIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Precio venta y Precio compra */}
        <Box className="flex space-x-4 mb-6">
          <Box className="flex-1">
            <TextField
              fullWidth
              label="Precio venta"
              name="price"
              value={product.price}
              onChange={handleChange}
              variant="outlined"
              required
            />
          </Box>
          <Box className="flex-1">
            <TextField
              fullWidth
              label="Precio compra"
              name="costPrice"
              value={product.costPrice}
              onChange={handleChange}
              variant="outlined"
              required
            />
          </Box>
        </Box>

        <Box className="flex space-x-4 mb-6">
          <Box className="flex-1">
            <TextField
              fullWidth
              label="Stock"
              name="stock"
              value={product.stock}
              onChange={handleChange}
              variant="outlined"
            />
          </Box>

          <Box className="flex-1">
            <TextField
              label="Código Categoría"
              fullWidth
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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

            {/* Modal para seleccionar categoria */}
            <ModalSearchCategories
              open={openModal}
              handleClose={() => setOpenModal(false)}
              handleSelect={(selectedCategory) =>
                setCategory(selectedCategory.id)
              }
            />
          </Box>
        </Box>

        {/* Categoría y Descuento */}
        <Box className="flex space-x-4 mb-6">
          <Box className="flex-1 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <FormControlLabel
              control={
                <Switch
                  name="discount"
                  checked={product.discount}
                  onChange={(e) =>
                    setProduct((prevProduct) => ({
                      ...prevProduct,
                      discount: e.target.checked,
                    }))
                  }
                />
              }
              label="¿Tiene descuento?"
            />
            {product.discount && (
              <TextField
                label="Descuento %"
                name="discountPercentage"
                type="number"
                value={product.discountPercentage}
                onChange={handleChange}
                variant="outlined"
                className="mt-2 sm:mt-4"
              />
            )}
          </Box>
        </Box>

        {/* Botones */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            type="submit"
            onClick={handleConfirmSale}
          >
            Actualizar Producto
          </Button>

          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteClick}
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
            Eliminar Producto
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

          {/* Botón para código QR */}
          <Button
            variant="contained"
            color="secondary"
            startIcon={<QrCodeIcon />}
            onClick={handleGenerateQrCode}
            sx={{
              borderRadius: 2,
              padding: "10px 20px",
              fontWeight: "bold",
              backgroundColor: "#4caf50",
              "&:hover": {
                backgroundColor: "#388e3c",
              },
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            Ver Código QR
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
      {/* Modal de Confirmación */}
      <ConfirmDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que deseas eliminar este producto?"
      />
      <Dialog
        open={openPdfModal}
        onClose={handleClosePdfModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Etiqueta del Producto</DialogTitle>
        <DialogContent>
          {pdfUrl && (
            <iframe
              src={pdfUrl}
              width="100%"
              height="500px"
              style={{ border: "none" }}
              title="Etiqueta del Producto"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePdfModal}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EditProductPage;
