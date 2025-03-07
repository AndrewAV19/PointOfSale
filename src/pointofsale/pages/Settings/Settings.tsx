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
  FormControlLabel,
  Switch,
} from "@mui/material";
import { Save as SaveIcon } from "@mui/icons-material";
import { storeDataPointOfSale } from "../../../stores/data-point-of-sale.store";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { DataPointOfSale } from "../../interfaces/data-point-of-sale.interface";

const Settings: React.FC = () => {
  const { getData, data, updateData } = storeDataPointOfSale();
  const [dataPointOfSale, setDataPointOfSale] = useState<DataPointOfSale>({
    name: data?.name ?? "",
    address: data?.address ?? "",
    phone: data?.phone ?? "",
    printTicket: data?.printTicket ?? false,
  });

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

  const handleSave = async () => {
    if (!dataPointOfSale.name.trim()) {
      showSnackbar("error", "El nombre del negocio no puede estar vacío.");
      return;
    }

    try {
      // Crear un objeto con solo los campos que han cambiado
      const updatedFields: Partial<DataPointOfSale> = {};

      if (data && dataPointOfSale.name !== data.name) {
        updatedFields.name = dataPointOfSale.name;
      }
      if (data && dataPointOfSale.address !== data.address) {
        updatedFields.address = dataPointOfSale.address;
      }
      if (data && dataPointOfSale.phone !== data.phone) {
        updatedFields.phone = dataPointOfSale.phone;
      }
      if (data && dataPointOfSale.printTicket !== data.printTicket) {
        updatedFields.printTicket = dataPointOfSale.printTicket;
      }

      // Solo enviar la solicitud si hay campos actualizados
      if (Object.keys(updatedFields).length > 0) {
        await updateData(1, updatedFields);
        showSnackbar(
          "success",
          "Datos del negocio actualizados correctamente."
        );
      }
    } catch (error) {
      console.error("Error al actualizar los datos del negocio:", error);
      showSnackbar("error", "Error al actualizar los datos del negocio.");
    }
  };

  const handleChange =
    (field: keyof DataPointOfSale) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setDataPointOfSale({
        ...dataPointOfSale,
        [field]: e.target.value,
      });
    };

  const handleSwitchChange =
    (field: keyof DataPointOfSale) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDataPointOfSale((prevState) => ({
        ...prevState,
        [field]: e.target.checked,
      }));
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
            value={dataPointOfSale.name}
            onChange={handleChange("name")}
            className="bg-white"
            helperText={
              !dataPointOfSale.name ? "Este campo es obligatorio" : ""
            }
          />

          <TextField
            fullWidth
            label="Dirección del Negocio"
            variant="outlined"
            value={dataPointOfSale.address}
            onChange={handleChange("address")}
            className="bg-white"
          />

          <TextField
            fullWidth
            label="Teléfono del Negocio"
            variant="outlined"
            value={dataPointOfSale.phone}
            onChange={handleChange("phone")}
            className="bg-white"
          />

          <FormControlLabel
            control={
              <Switch
                checked={dataPointOfSale.printTicket}
                onChange={handleSwitchChange("printTicket")}
                color="primary"
              />
            }
            label="Imprimir Tickets"
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
