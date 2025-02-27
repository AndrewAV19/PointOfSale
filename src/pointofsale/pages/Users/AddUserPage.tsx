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
  MenuItem,
  IconButton,
} from "@mui/material";
import {
  Save as SaveIcon,
  Clear as ClearIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
  SupervisorAccount as RoleIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { UserRequest } from "../../interfaces/users.interface";
import { storeUsers } from "../../../stores/users.store";
import { useForm } from "../../../hooks/useForm";
import { useValidation } from "../../../hooks/useValidation";
import { useSnackbar } from "../../../hooks/useSnackbar";

const AddUser: React.FC = () => {
  const initialUserState: UserRequest = {
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: 0,
    country: "",
    roleIds: [],
  };

  const { form: user, handleChange, resetForm } = useForm(initialUserState);
  const requiredFields = ["name", "email", "phone", "password", "roleIds"];
  const { validateRequiredFields, validateEmail } = useValidation();

  const {
    openSnackbar,
    snackbarSeverity,
    messageSnackbar,
    showSnackbar,
    closeSnackbar,
  } = useSnackbar();

  const [showPassword, setShowPassword] = useState(false);
  const [rolesSeleccionados, setRolesSeleccionados] = useState<number[]>([]);
  console.log(setRolesSeleccionados)

  useEffect(() => {
    resetForm(); 
  }, []);

  const handleConfirm = async () => {
    // Validar campos obligatorios
    if (!validateRequiredFields(user, requiredFields)) {
      showSnackbar(
        "error",
        "Por favor, completa todos los campos obligatorios."
      );
      return;
    }

    // Validar formato de correo electrónico
    if (!validateEmail(user.email)) {
      showSnackbar("error", "Correo electrónico no válido.");
      return;
    }

    try {
      await storeUsers.getState().createUser({
        name: user.name,
        email: user.email,
        password: user.password,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        zipCode: user.zipCode,
        country: user.country,
        roleIds: rolesSeleccionados,
      });

      showSnackbar("success", "Usuario agregado correctamente.");
      resetForm(); 
    } catch (error) {
      showSnackbar("error", "Error al crear el usuario.");
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
          Agregar Usuario
        </Typography>

        {/* Formulario */}
        <Box component="form" noValidate autoComplete="off">
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Nombre"
              name="name"
              value={user.name}
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
              value={user.email}
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
              label="Contraseña"
              name="password"
              type={showPassword ? "text" : "password"}
              value={user.password}
              onChange={handleChange}
              variant="outlined"
              required
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
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
              value={user.phone}
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
              value={user.address}
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
              value={user.city}
              onChange={handleChange}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Estado"
              name="state"
              value={user.state}
              onChange={handleChange}
              variant="outlined"
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Código Postal"
              name="zipCode"
              value={user.zipCode}
              onChange={handleChange}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="País"
              name="country"
              value={user.country}
              onChange={handleChange}
              variant="outlined"
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <TextField
              select
              fullWidth
              label="Rol"
              name="rol"
              value={user.roleIds}
              onChange={handleChange}
              variant="outlined"
              required
              sx={{ width: "30%" }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <RoleIcon />
                    </InputAdornment>
                  ),
                },
              }}
            >
              <MenuItem value="Administrador">Administrador</MenuItem>
              <MenuItem value="Empleado">Empleado</MenuItem>
            </TextField>
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
              Agregar Usuario
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

export default AddUser;