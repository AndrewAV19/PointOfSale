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
} from "@mui/material";
import {
  Save as SaveIcon,
  AddPhotoAlternate as AddPhotoIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { ModalSearchCategories } from "../../modales/ModalSearchCategories";
import { Supplier } from "../../interfaces/supplier.interface";
import { ModalSearchSuppliers } from "../../modales/ModalSearchSuppliers";

const AddProduct: React.FC = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    categoryId: 0,
    discount: false,
    discountPercentage: 0,
    photo: null as File | null,
    suppliers: [] as Supplier[],
  });
  const [category, setCategory] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openSupplierModal, setOpenSupplierModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "warning"
  >("success");
  const [messageSnackbar, setMessageSnackbar] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

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
      name: "",
      description: "",
      price: 0,
      stock: 0,
      categoryId: 0,
      discount: false,
      discountPercentage: 0,
      photo: null,
      suppliers: [],
    });
    setCategory("");
    setPreview(null);
  };

  const handleOpenSnackbar = (message: string) => {
    setMessageSnackbar(message);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleConfirmSale = () => {
    // Verificar si faltan campos obligatorios
    if (
      !product.name ||
      product.price === undefined ||
      product.stock === undefined
    ) {
      setSnackbarSeverity("error");
      handleOpenSnackbar("Todos los campos obligatorios deben ser llenados.");
      return;
    }

    // Verificar si el precio es 0
    if (product.price === 0) {
      setSnackbarSeverity("error");
      handleOpenSnackbar("El precio no puede ser 0.");
      return;
    }

    // Verificar si el precio y stock contienen solo números y puntos
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

    // Si todos los campos están correctos
    setSnackbarSeverity("success");
    handleOpenSnackbar("Producto agregado correctamente.");
    console.log("categoria: " + category);
  };

  const handleRemoveSupplier = (supplierId: number) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      suppliers: prevProduct.suppliers.filter(
        (supplier) => supplier.id !== supplierId
      ),
    }));
  };

  return (
    <Container className="py-8">
      <Paper elevation={3} className="p-6">
        <Typography
          variant="h4"
          component="h1"
          className="mb-6 text-center font-bold"
        >
          Agregar Producto
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

        {/* Precio y Stock */}
        <Box className="flex space-x-4 mb-6">
          <Box className="flex-1">
            <TextField
              fullWidth
              label="Precio"
              name="price"
              type="number"
              value={product.price}
              onChange={handleChange}
              variant="outlined"
              required
            />
          </Box>
          <Box className="flex-1">
            <TextField
              fullWidth
              label="Stock"
              name="stock"
              type="number"
              value={product.stock}
              onChange={handleChange}
              variant="outlined"
            />
          </Box>
        </Box>

        {/* Categoría y Descuento */}
        <Box className="flex space-x-4 mb-6">
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
        <Box className="flex justify-end space-x-4">
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            type="submit"
            onClick={() => {
              handleConfirmSale();
              handleReset();
            }}
          >
            Crear Producto
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
    </Container>
  );
};

export default AddProduct;
