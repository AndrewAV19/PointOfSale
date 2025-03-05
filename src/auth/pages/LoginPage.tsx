import { useState, ChangeEvent, FormEvent } from "react";
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Box,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  AccountCircle,
  Lock,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { LoginResponse } from "../interfaces/loginResponse.interface";
import { AuthService } from "../services/AuthService";

interface Credentials {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState<Credentials>({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [messageSnackbar, setMessageSnackbar] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "error"
  );
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Verificar si los campos están vacíos
    if (!credentials.username || !credentials.password) {
      setSnackbarSeverity("error");
      setMessageSnackbar("Debes llenar todos los campos");
      setOpenSnackbar(true);
      return; // Detener el envío del formulario si algún campo está vacío
    }

    try {
      const response: LoginResponse = await AuthService.login({
        email: credentials.username,
        password: credentials.password,
      });

      // Si la autenticación es exitosa, guarda el token en el localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("id_usuario", response.id.toString());
      localStorage.setItem("name_usuario", response.name);
      localStorage.setItem("loginTime", new Date().toISOString());
      localStorage.setItem("roles", response.roles);

      // Redirigir al usuario después de un inicio de sesión exitoso
      navigate("/");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setSnackbarSeverity("error");
      setMessageSnackbar("Email o contraseña incorrectos");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg,rgb(255, 255, 255) 0%,rgb(28, 64, 105) 100%)",
        padding: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          maxWidth: 500,
          width: "100%",
          borderRadius: 3,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Iniciar Sesión
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            name="username"
            label="Usuario"
            variant="outlined"
            value={credentials.username}
            onChange={handleChange}
            margin="normal"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            name="password"
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            value={credentials.password}
            onChange={handleChange}
            margin="normal"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2, py: 1.5, fontWeight: "bold" }}
          >
            Iniciar Sesión
          </Button>
        </form>
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          ¿No tienes una cuenta?{" "}
          <button
            onClick={() => navigate("/auth/register")}
            style={{
              color: "#1976d2",
              textDecoration: "none",
              fontWeight: "bold",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              font: "inherit",
            }}
          >
            Regístrate
          </button>
        </Typography>
      </Paper>

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
    </Box>
  );
};

export default LoginPage;
