import React, { useEffect, useState } from "react";
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
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { Categories } from "../../interfaces/categories.interface";
import { storeCategories } from "../../../stores/categories.store";
import { useNavigate } from "react-router";
import { dataStore } from "../../../stores/generalData.store";
import ConfirmDialog from "../../../components/ConfirmDeleteModal";
import { useForm } from "../../../hooks/useForm";
import { useValidation } from "../../../hooks/useValidation";
import { useSnackbar } from "../../../hooks/useSnackbar";

const EditCategoryPage: React.FC = () => {
  const initialCategoryState: Categories = {
    name: "",
    description: "",
  };

  const convertToCategoryRequest = (selectedCategory: Categories): Categories => {
    return {
      name: selectedCategory.name,
      description: selectedCategory.description,
    };
  };

  const navigate = useNavigate();
  const { selectedCategory } = dataStore();
  const { deleteCategory } = storeCategories();

  const { form: category, handleChange, resetForm } = useForm(
    selectedCategory ? convertToCategoryRequest(selectedCategory) : initialCategoryState
  );

  const { validateRequiredFields } = useValidation();

  const {
    openSnackbar,
    snackbarSeverity,
    messageSnackbar,
    showSnackbar,
    closeSnackbar,
  } = useSnackbar();

  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (selectedCategory) {
      resetForm();
    }
  }, [selectedCategory]);

  const handleSaveChanges = async () => {
    if (!validateRequiredFields(category, ["name"])) {
      showSnackbar(
        "error",
        "Por favor, completa todos los campos obligatorios."
      );
      return;
    }

    try {
      const originalCategory = selectedCategory;

      const updatedFields = originalCategory
        ? getUpdatedFields(category, originalCategory)
        : {};

      const finalUpdateFields = {
        name: updatedFields.name ?? category.name,
        description: updatedFields.description ?? category.description,
      };

      await storeCategories
        .getState()
        .updateCategory(selectedCategory?.id ?? 0, finalUpdateFields);

      showSnackbar("success", "Categoría actualizada correctamente.");
    } catch (error) {
      showSnackbar("error", "Error al actualizar la categoría.");
    }
  };

  const getUpdatedFields = (
    category: Categories,
    originalCategory: Categories
  ): Partial<Categories> => {
    const updatedFields: Partial<Categories> = {};

    if (category.name !== originalCategory.name) updatedFields.name = category.name;
    if (category.description !== originalCategory.description)
      updatedFields.description = category.description;

    return updatedFields;
  };

  const handleDeleteClick = () => {
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteCategory(selectedCategory?.id ?? 0);
      navigate(`/categorias/historial`);
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Container sx={{ py: 4 }}>
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
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ mb: 4, textAlign: "center", fontWeight: "bold" }}
        >
          Editar Categoría
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
              onClick={handleSaveChanges}
              sx={{
                borderRadius: 2,
                px: 3,
                fontWeight: "bold",
                textTransform: "none",
              }}
            >
              Guardar Cambios
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
              Eliminar Categoría
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

      {/* Modal de Confirmación */}
      <ConfirmDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que deseas eliminar esta categoría?"
      />
    </Container>
  );
};

export default EditCategoryPage;