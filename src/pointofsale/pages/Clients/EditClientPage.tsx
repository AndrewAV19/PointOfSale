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
} from "@mui/icons-material";
import { Clients } from "../../interfaces/clients.interface";
import { storeClients } from "../../../stores/clients.store";
import { useNavigate } from "react-router";
import { dataStore } from "../../../stores/generalData.store";
import ConfirmDialog from "../../../components/ConfirmDeleteModal";

const EditClientPage: React.FC = () => {
  const initialClientState: Clients = {
    id: 0,
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: 0,
    country: "",
  };
  const navigate = useNavigate();
  const { selectedClient } = dataStore();
  const { deleteClient } = storeClients();
  const [client, setClient] = useState<Clients>(initialClientState);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("success");
  const [messageSnackbar, setMessageSnackbar] = useState("");

  useEffect(() => {
    setClient(initialClientState);
  }, []);

  useEffect(() => {
    if (selectedClient) {
      setClient({
        name: selectedClient.name,
        email: selectedClient.email,
        phone: selectedClient.phone,
        address: selectedClient.address,
        city: selectedClient.city,
        state: selectedClient.state,
        zipCode: selectedClient.zipCode,
        country: selectedClient.country,
      });
    }
  }, [selectedClient]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "zipCode") {
      const numericValue = value.replace(/\D/g, "");
      setClient((prevClient) => ({
        ...prevClient,
        [name]: numericValue ? parseInt(numericValue, 10) : 0,
      }));
    } else {
      setClient((prevClient) => ({
        ...prevClient,
        [name]: value,
      }));
    }
  };

  const handleReset = () => {
    setClient(initialClientState);
  };

  const handleSaveChanges = async () => {
    // Validar campos obligatorios
    if (!validateRequiredFields(client)) {
      showSnackbar(
        "error",
        "Por favor, completa todos los campos obligatorios."
      );
      return;
    }
    // Validar formato de correo electrónico
    if (!validateEmail(client.email)) {
      showSnackbar("error", "Correo electrónico no válido.");
      return;
    }

    try {
      // Obtener los valores originales del usuario seleccionado
      const originalClient = selectedClient;

      const updatedFields = originalClient
        ? getUpdatedFields(client, originalClient)
        : {};

      const finalUpdateFields = {
        name: updatedFields.name ?? client.name,
        email: updatedFields.email ?? client.email,
        phone: updatedFields.phone ?? client.phone,
        address: updatedFields.address ?? client.address,
        city: updatedFields.city ?? client.city,
        state: updatedFields.state ?? client.state,
        zipCode: updatedFields.zipCode ?? client.zipCode,
        country: updatedFields.country ?? client.country,
      };

      // Enviar la solicitud
      await storeClients
        .getState()
        .updateClient(selectedClient?.id ?? 0, finalUpdateFields);

      showSnackbar("success", "Cliente actualizado correctamente.");
    } catch (error) {
      showSnackbar("error", "Error al actualizar el cliente.");
    }
  };

  const validateRequiredFields = (client: Clients): boolean => {
    return !!client.name && !!client.email;
  };

  const validateEmail = (email: string): boolean => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const showSnackbar = (
    severity: "error" | "success",
    message: string
  ): void => {
    setSnackbarSeverity(severity);
    setMessageSnackbar(message);
    setOpenSnackbar(true);
  };

  const getUpdatedFields = (
    client: Clients,
    originalClient: Clients
  ): Partial<Clients> => {
    const updatedFields: Partial<Clients> = {};

    if (client.name !== originalClient.name) updatedFields.name = client.name;
    if (client.email !== originalClient.email)
      updatedFields.email = client.email;
    if (client.phone !== originalClient.phone)
      updatedFields.phone = client.phone;
    if (client.address !== originalClient.address)
      updatedFields.address = client.address;
    if (client.city !== originalClient.city) updatedFields.city = client.city;
    if (client.state !== originalClient.state)
      updatedFields.state = client.state;
    if (client.zipCode !== originalClient.zipCode)
      updatedFields.zipCode = client.zipCode;
    if (client.country !== originalClient.country)
      updatedFields.country = client.country;

    return updatedFields;
  };

  const handleDeleteClick = () => {
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteClient(selectedClient?.id ?? 0);
      navigate(`/clientes/historial`);
    } catch (error) {
      console.error("Error al eliminar el cliente:", error);
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
          Editar Cliente
        </Typography>

        {/* Formulario */}
        <Box component="form" noValidate autoComplete="off">
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Nombre"
              name="name"
              value={client.name}
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
              value={client.email}
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
              value={client.phone}
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
              value={client.address}
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
              value={client.city}
              onChange={handleChange}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Estado"
              name="state"
              value={client.state}
              onChange={handleChange}
              variant="outlined"
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Código Postal"
              name="zipCode"
              value={client.zipCode}
              onChange={handleChange}
              variant="outlined"
            />

            <TextField
              fullWidth
              label="País"
              name="country"
              value={client.country}
              onChange={handleChange}
              variant="outlined"
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
              onClick={() => handleDeleteClick()}
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
              Eliminar Cliente
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

      {/* Modal de Confirmación */}
      <ConfirmDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que deseas eliminar este cliente?"
      />
    </Container>
  );
};

export default EditClientPage;
