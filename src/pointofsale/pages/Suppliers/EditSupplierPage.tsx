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
  InputAdornment,
} from "@mui/material";
import {
  Save as SaveIcon,
  Clear as ClearIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Business as BusinessIcon,
  Language as LanguageIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router";
import { dataStore } from "../../../stores/generalData.store";
import ConfirmDialog from "../../../components/ConfirmDeleteModal";
import { useForm } from "../../../hooks/useForm";
import { useValidation } from "../../../hooks/useValidation";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { Supplier } from "../../interfaces/supplier.interface";
import { storeSuppliers } from "../../../stores/suppliers.store";

const EditSupplierPage: React.FC = () => {
  const initialSupplierState: Supplier = {
    name: "",
    contactName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: 0,
    country: "",
    taxId: "",
    website: "",
  };

  const convertToSupplierRequest = (selectedSupplier: Supplier): Supplier => {
    return {
      name: selectedSupplier.name,
      contactName: selectedSupplier.contactName,
      email: selectedSupplier.email,
      phone: selectedSupplier.phone,
      address: selectedSupplier.address,
      city: selectedSupplier.city,
      state: selectedSupplier.state,
      zipCode: selectedSupplier.zipCode,
      country: selectedSupplier.country,
      taxId: selectedSupplier.taxId,
      website: selectedSupplier.website,
    };
  };

  const navigate = useNavigate();
  const { selectedSupplier } = dataStore();
  const { deleteSupplier } = storeSuppliers();

  const {
    form: supplier,
    handleChange,
    resetForm,
  } = useForm(
    selectedSupplier
      ? convertToSupplierRequest(selectedSupplier)
      : initialSupplierState
  );

  const { validateRequiredFields, validateEmail } = useValidation();

  const {
    openSnackbar,
    snackbarSeverity,
    messageSnackbar,
    showSnackbar,
    closeSnackbar,
  } = useSnackbar();

  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (selectedSupplier) {
      resetForm();
    }
  }, [selectedSupplier]);

  const handleSaveChanges = async () => {
    if (!validateRequiredFields(supplier, [])) {
      showSnackbar(
        "error",
        "Por favor, completa todos los campos obligatorios."
      );
      return;
    }

    if (!validateEmail(supplier.email)) {
      showSnackbar("error", "Correo electrónico no válido.");
      return;
    }

    try {
      const originalSupplier = selectedSupplier;

      const updatedFields = originalSupplier
        ? getUpdatedFields(supplier, originalSupplier)
        : {};

      const finalUpdateFields = {
        name: updatedFields.name ?? supplier.name,
        contactName: updatedFields.contactName ?? supplier.contactName,
        email: updatedFields.email ?? supplier.email,
        phone: updatedFields.phone ?? supplier.phone,
        address: updatedFields.address ?? supplier.address,
        city: updatedFields.city ?? supplier.city,
        state: updatedFields.state ?? supplier.state,
        zipCode: updatedFields.zipCode ?? supplier.zipCode,
        country: updatedFields.country ?? supplier.country,
        taxId: updatedFields.taxId ?? supplier.taxId,
        website: updatedFields.website ?? supplier.website,
      };

      await storeSuppliers
        .getState()
        .updateSupplier(selectedSupplier?.id ?? 0, finalUpdateFields);

      showSnackbar("success", "Proveedor actualizado correctamente.");
    } catch (error) {
      showSnackbar("error", "Error al actualizar el proveedor.");
    }
  };

  const getUpdatedFields = (
    supplier: Supplier,
    originalSupplier: Supplier
  ): Partial<Supplier> => {
    const updatedFields: Partial<Supplier> = {};

    if (supplier.name !== originalSupplier.name) updatedFields.name = supplier.name;
    if (supplier.contactName !== originalSupplier.contactName)
      updatedFields.contactName = supplier.contactName;
    if (supplier.email !== originalSupplier.email)
      updatedFields.email = supplier.email;
    if (supplier.phone !== originalSupplier.phone)
      updatedFields.phone = supplier.phone;
    if (supplier.address !== originalSupplier.address)
      updatedFields.address = supplier.address;
    if (supplier.city !== originalSupplier.city) updatedFields.city = supplier.city;
    if (supplier.state !== originalSupplier.state)
      updatedFields.state = supplier.state;
    if (supplier.zipCode !== originalSupplier.zipCode)
      updatedFields.zipCode = supplier.zipCode;
    if (supplier.country !== originalSupplier.country)
      updatedFields.country = supplier.country;
    if (supplier.taxId !== originalSupplier.taxId)
      updatedFields.taxId = supplier.taxId;
    if (supplier.website !== originalSupplier.website)
      updatedFields.website = supplier.website;

    return updatedFields;
  };

  const handleDeleteClick = () => {
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteSupplier(selectedSupplier?.id ?? 0);
      navigate(`/proveedores/historial`);
    } catch (error) {
      console.error("Error al eliminar el proveedor:", error);
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
          Editar Proveedor
        </Typography>

        {/* Formulario */}
        <Box component="form" noValidate autoComplete="off">
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Nombre"
              name="name"
              value={supplier.name}
              onChange={handleChange}
              variant="outlined"
              required
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Nombre contacto"
              name="contactName"
              value={supplier.contactName}
              onChange={handleChange}
              variant="outlined"
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Correo Electrónico"
              name="email"
              value={supplier.email}
              onChange={handleChange}
              variant="outlined"
              required
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Teléfono"
              name="phone"
              value={supplier.phone}
              onChange={handleChange}
              variant="outlined"
              required
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Dirección"
              name="address"
              value={supplier.address}
              onChange={handleChange}
              variant="outlined"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Ciudad"
              name="city"
              value={supplier.city}
              onChange={handleChange}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Estado"
              name="state"
              value={supplier.state}
              onChange={handleChange}
              variant="outlined"
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Código Postal"
              name="zipCode"
              value={supplier.zipCode}
              onChange={handleChange}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="País"
              name="country"
              value={supplier.country}
              onChange={handleChange}
              variant="outlined"
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Tax ID"
              name="taxId"
              value={supplier.taxId}
              onChange={handleChange}
              variant="outlined"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <BusinessIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Sitio Web"
              name="website"
              value={supplier.website}
              onChange={handleChange}
              variant="outlined"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LanguageIcon />
                    </InputAdornment>
                  ),
                },
              }}
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
              Eliminar suppliere
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
        message="¿Estás seguro de que deseas eliminar este proveedor?"
      />
    </Container>
  );
};

export default EditSupplierPage;
