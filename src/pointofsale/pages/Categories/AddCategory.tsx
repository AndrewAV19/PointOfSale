import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Box,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { Save as SaveIcon, Clear as ClearIcon } from "@mui/icons-material";

const AddCategory: React.FC = () => {
  const [category, setCategory] = useState({
    id: 0,
    name: "",
    description: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "warning"
  >("success");
  const [messageSnackbar, setMessageSnackbar] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setCategory((prevCategory) => ({
      ...prevCategory,
      [name as string]: value,
    }));
  };

  const handleReset = () => {
    setCategory({
      id: 0,
      name: "",
      description: "",
    });
  };

  const handleOpenSnackbar = (message: string) => {
    setMessageSnackbar(message);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleSaveCategory = () => {
    if (!category.name || !category.description) {
      setSnackbarSeverity("error");
      handleOpenSnackbar("Todos los campos son obligatorios.");
      return;
    }

    setSnackbarSeverity("success");
    handleOpenSnackbar("Categoría agregada correctamente.");
    console.log("Categoría guardada:", category);
  };

  return (
    <Container className="py-8">
      <Paper elevation={3} className="p-6">
        <Typography
          variant="h4"
          component="h1"
          className="mb-10 text-center font-bold"
        >
          Agregar Categoría
        </Typography>

        {/* Nombre de la Categoría */}
        <Box className="mb-6 mt-5">
          <TextField
            fullWidth
            label="Nombre de la Categoría"
            name="name"
            value={category.name}
            onChange={handleChange}
            variant="outlined"
            required
          />
        </Box>

        {/* Descripción de la Categoría */}
        <Box className="mb-6">
          <TextField
            fullWidth
            label="Descripción"
            name="description"
            value={category.description}
            onChange={handleChange}
            variant="outlined"
            multiline
            rows={4}
          />
        </Box>

        {/* Botones */}
        <Box className="flex justify-end space-x-4">
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSaveCategory}
          >
            Crear Categoría
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

export default AddCategory;
