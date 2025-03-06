import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { Save as SaveIcon } from "@mui/icons-material";
import { storeDataPointOfSale } from "../../../stores/data-point-of-sale.store";
import { useSnackbar } from "../../../hooks/useSnackbar";

const Settings: React.FC = () => {
  const [businessName, setBusinessName] = useState<string>("");
  const { getData, data, updateData } = storeDataPointOfSale();

  const {
    openSnackbar,
    snackbarSeverity,
    messageSnackbar,
    showSnackbar,
    closeSnackbar,
  } = useSnackbar();

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    if (data?.name) {
      setBusinessName(data.name);
    }
  }, [data]);

  const handleSave = async () => {
    if (!businessName.trim()) {
      showSnackbar("error", "El nombre del negocio no puede estar vacío.");
      return;
    }

    try {
      await updateData(1, { name: businessName });
      showSnackbar("success", "Nombre del negocio actualizado correctamente.");
    } catch (error) {
      console.error("Error al actualizar el nombre del negocio:", error);
      showSnackbar("error", "Error al actualizar el nombre del negocio.");
    }
  };

  return (
    <Container className="mt-10">
      <Paper elevation={3} className="p-6">
        <Typography
          variant="h4"
          component="h1"
          className="mb-8 text-center font-bold"
        >
          Configuración
        </Typography>

        <Box
          component="form"
          noValidate
          autoComplete="off"
          className="space-y-6"
        >
          <TextField
            fullWidth
            label="Nombre del Negocio"
            variant="outlined"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="bg-white"
            error={!businessName.trim()}
            helperText={!businessName.trim() ? "Este campo es obligatorio" : ""}
          />

          <Box className="flex justify-end">
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Guardar Cambios
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Snackbar para mostrar notificaciones */}
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

export default Settings;
