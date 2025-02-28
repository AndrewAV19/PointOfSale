import React from "react";
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
import {
  Save as SaveIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { Categories } from "../../interfaces/categories.interface";
import { storeCategories } from "../../../stores/categories.store";
import { useForm } from "../../../hooks/useForm";
import { useValidation } from "../../../hooks/useValidation";
import { useSnackbar } from "../../../hooks/useSnackbar";

const AddCategory: React.FC = () => {
  const initialCategoryState: Categories = {
    name: "",
    description: "",
  };

  const { form: category, handleChange, resetForm } = useForm(initialCategoryState);
  const requiredFields = ["name"];
  const { validateRequiredFields } = useValidation();

  const {
    openSnackbar,
    snackbarSeverity,
    messageSnackbar,
    showSnackbar,
    closeSnackbar,
  } = useSnackbar();

  const handleConfirm = async () => {
    if (!validateRequiredFields(category, requiredFields)) {
      showSnackbar("error", "Por favor, completa los campos obligatorios.");
      return;
    }

    try {
      await storeCategories.getState().createCategory({
        name: category.name,
        description: category.description,
      });

      showSnackbar("success", "Categoría agregada correctamente.");
      resetForm(); 
    } catch (error) {
      showSnackbar("error", "Error al crear la categoría.");
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ mb: 4, textAlign: "center", fontWeight: "bold" }}
        >
          Agregar Categoría
        </Typography>

        {/* Formulario */}
        <Box component="form" noValidate autoComplete="off">
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Nombre"
              name="name"
              value={category.name}
              onChange={handleChange}
              variant="outlined"
              required
            />
          </Box>

          <Box sx={{ mb: 2 }}>
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
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleConfirm}
              sx={{
                borderRadius: 2,
                px: 3,
                fontWeight: "bold",
                textTransform: "none",
              }}
            >
              Agregar Categoría
            </Button>

            <Button
              variant="outlined"
              color="error"
              startIcon={<ClearIcon />}
              onClick={resetForm}
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
              Limpiar campos
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Snackbar de confirmación y errores */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbarSeverity} sx={{ width: "100%" }}>
          {messageSnackbar}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddCategory;