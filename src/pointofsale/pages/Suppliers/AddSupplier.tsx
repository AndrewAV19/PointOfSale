import React, { useState } from "react";
import { TextField, Button, Container, Box, Typography, Paper, Snackbar, Alert, InputAdornment, } from "@mui/material";
import { Save as SaveIcon, Clear as ClearIcon, Email as EmailIcon, Phone as PhoneIcon, LocationOn as LocationOnIcon, Business as BusinessIcon, Language as LanguageIcon } from "@mui/icons-material";
import { Supplier } from "../../interfaces/supplier.interface";

const AddSupplier: React.FC = () => {
    
  const initialSupplierState: Supplier = {
    id: 0,
    name: "",
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

  const [supplier, setSupplier] = useState<Supplier>(initialSupplierState);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [messageSnackbar, setMessageSnackbar] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "zipCode") {
      const numericValue = value.replace(/\D/g, "");
      setSupplier((prevSupplier) => ({
        ...prevSupplier,
        [name]: numericValue ? parseInt(numericValue, 10) : 0,
      }));
    } else {
      setSupplier((prevClient) => ({
        ...prevClient,
        [name]: value,
      }));
    }
  };

  const handleReset = () => {
    setSupplier(initialSupplierState);
  };

  const handleConfirm = () => {
    if (!supplier.name || !supplier.email || !supplier.phone) {
      setSnackbarSeverity("error");
      setMessageSnackbar("Por favor, completa los campos obligatorios.");
      setOpenSnackbar(true);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(supplier.email)) {
      setSnackbarSeverity("error");
      setMessageSnackbar("Correo electrónico no válido.");
      setOpenSnackbar(true);
      return;
    }
    setSnackbarSeverity("success");
    setMessageSnackbar("Cliente agregado correctamente.");
    setOpenSnackbar(true);
    handleReset();
  };

  return (
    <Container sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ mb: 4, textAlign: "center", fontWeight: "bold" }}
        >
          Agregar Proveedor
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
              onClick={handleConfirm}
              sx={{
                borderRadius: 2,
                px: 3,
                fontWeight: "bold",
                textTransform: "none",
              }}
            >
              Agregar Proveedor
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
              Limpiar campos
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Snackbar de confirmación y errores */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbarSeverity} sx={{ width: "100%" }}>
          {messageSnackbar}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddSupplier;
