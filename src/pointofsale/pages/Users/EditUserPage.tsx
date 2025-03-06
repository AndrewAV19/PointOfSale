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
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { UserRequest, Users } from "../../interfaces/users.interface";
import { storeUsers } from "../../../stores/users.store";
import { dataStore } from "../../../stores/generalData.store";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../../../components/ConfirmDeleteModal";
import { useForm } from "../../../hooks/useForm";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { useValidation } from "../../../hooks/useValidation";

const EditUserPage: React.FC = () => {
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

  const convertToUserRequest = (selectedUser: Users): UserRequest => {
    return {
      name: selectedUser.name,
      email: selectedUser.email,
      password: selectedUser.password ?? "",
      phone: selectedUser.phone,
      address: selectedUser.address,
      city: selectedUser.city,
      state: selectedUser.state,
      zipCode: selectedUser.zipCode,
      country: selectedUser.country,
      roleIds: selectedUser.roles.map((role) => role.id),
    };
  };

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [rolesSeleccionados, setRolesSeleccionados] = useState<number[]>([]);
  const { selectedUser } = dataStore();
  const { deleteUser } = storeUsers();

  const {
    form: user,
    handleChange,
    resetForm,
  } = useForm(
    selectedUser ? convertToUserRequest(selectedUser) : initialUserState
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
    if (selectedUser) {
      const userRequest = convertToUserRequest(selectedUser);
      console.log(userRequest);
      resetForm();
    }
  }, [selectedUser]);

  console.log(setRolesSeleccionados);

  const handleSaveChanges = async () => {
    if (!validateRequiredFields(user, [])) {
      showSnackbar(
        "error",
        "Por favor, completa todos los campos obligatorios."
      );
      return;
    }

    if (!validateEmail(user.email)) {
      showSnackbar("error", "Correo electrónico no válido.");
      return;
    }

    try {
      const originalUser = selectedUser
        ? convertToUserRequest(selectedUser)
        : null;

      const updatedFields = originalUser
        ? getUpdatedFields(user, originalUser, newPassword, rolesSeleccionados)
        : {};

      // Si se proporciona una contraseña actual y una nueva, cambiar la contraseña
      if (currentPassword && newPassword) {
        await storeUsers
          .getState()
          .changePassword(selectedUser?.id ?? 0, currentPassword, newPassword);
        showSnackbar("success", "Contraseña actualizada correctamente.");
      }

      // Actualizar los campos del usuario
      if (Object.keys(updatedFields).length > 0) {
        const finalUpdateFields = {
          name: updatedFields.name ?? user.name,
          email: updatedFields.email ?? user.email,
          phone: updatedFields.phone ?? user.phone,
          address: updatedFields.address ?? user.address,
          city: updatedFields.city ?? user.city,
          state: updatedFields.state ?? user.state,
          zipCode: updatedFields.zipCode ?? user.zipCode,
          country: updatedFields.country ?? user.country,
          roleIds: updatedFields.roleIds ?? user.roleIds,
        };

        await storeUsers
          .getState()
          .updateUser(selectedUser?.id ?? 0, finalUpdateFields);

        showSnackbar("success", "Usuario actualizado correctamente.");
      }

      clearPasswordFields();
    } catch (error) {
      showSnackbar("error", "Error al actualizar el usuario.");
    }
  };

  const handleRoleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedRole = event.target.value as string;

    // Asignar los roles correspondientes
    if (selectedRole === "Administrador") {
      setRolesSeleccionados([1, 2]);
    } else if (selectedRole === "Empleado") {
      setRolesSeleccionados([2]);
    }

    const syntheticEvent = {
      ...event,
      target: {
        ...event.target,
        name: "roleIds",
        value: selectedRole,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    handleChange(syntheticEvent);
  };

  const getUpdatedFields = (
    user: UserRequest,
    originalUser: UserRequest,
    newPassword: string,
    rolesSeleccionados: number[]
  ): Partial<UserRequest> => {
    const updatedFields: Partial<UserRequest> = {};

    if (user.name !== originalUser.name) updatedFields.name = user.name;
    if (user.email !== originalUser.email) updatedFields.email = user.email;
    if (newPassword && newPassword !== originalUser.password)
      updatedFields.password = newPassword;
    if (user.phone !== originalUser.phone) updatedFields.phone = user.phone;
    if (user.address !== originalUser.address)
      updatedFields.address = user.address;
    if (user.city !== originalUser.city) updatedFields.city = user.city;
    if (user.state !== originalUser.state) updatedFields.state = user.state;
    if (user.zipCode !== originalUser.zipCode)
      updatedFields.zipCode = user.zipCode;
    if (user.country !== originalUser.country)
      updatedFields.country = user.country;
    if (
      JSON.stringify(rolesSeleccionados) !==
      JSON.stringify(originalUser.roleIds)
    ) {
      updatedFields.roleIds = rolesSeleccionados;
    }

    return updatedFields;
  };

  const clearPasswordFields = (): void => {
    setCurrentPassword("");
    setNewPassword("");
  };

  const handleDeleteClick = () => {
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUser(selectedUser?.id ?? 0);
      navigate("/usuarios/historial");
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // Función para determinar el rol del usuario
  const getRoleName = (roleIds: number[]): string => {
    if (roleIds.includes(1) && roleIds.includes(2)) {
      return "Administrador";
    } else if (roleIds.includes(1)) {
      return "Administrador";
    } else if (roleIds.includes(2)) {
      return "Empleado";
    } else {
      return "Empleado"; // Por defecto
    }
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
          Editar Usuario
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
              label="Contraseña Actual"
              name="currentPassword"
              type={showPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              variant="outlined"
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
              label="Nueva Contraseña"
              name="newPassword"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              variant="outlined"
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
              name="roleIds"
              value={getRoleName(user.roleIds)}
              onChange={handleRoleChange}
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
              Eliminar Usuario
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
        message="¿Estás seguro de que deseas eliminar este usuario?"
      />
    </Container>
  );
};

export default EditUserPage;
