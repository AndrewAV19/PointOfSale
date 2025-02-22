import React, { useState } from "react";
import { TextField, Button, Container, Box, Typography, Paper, FormControlLabel, Switch, Avatar, InputAdornment, IconButton, } from "@mui/material";
import { Save as SaveIcon,  AddPhotoAlternate as AddPhotoIcon, Search as SearchIcon, Clear as ClearIcon, } from "@mui/icons-material";
import { ModalSearchCategories } from "../../modales/ModalSearchCategories";

const AddProduct: React.FC = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    discount: false,
    discountPercentage: "",
    photo: null as File | null,
  });
  const [category, setCategory] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
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

  const handleReset = () => {
    setProduct({
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "",
      discount: false,
      discountPercentage: "",
      photo: null,
    });
    setCategory(""); 
    setPreview(null); 
  };
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Producto agregado:", product);
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
        <form onSubmit={handleSubmit}>
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
                required
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
            >
              Guardar Producto
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
        </form>
      </Paper>
    </Container>
  );
};

export default AddProduct;
