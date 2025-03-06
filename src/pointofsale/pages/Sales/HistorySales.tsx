import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Input,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Search, Visibility, Download } from "@mui/icons-material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { storeSales } from "../../../stores/sales.store";
import { dataStore } from "../../../stores/generalData.store";
import ConfirmCancelDialog from "../../../components/ConfirmCancelModal";

export default function HistorySales() {
  const { listSales, getSales, cancelSale } = storeSales();
  const { getSaleById } = dataStore();
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const navigate = useNavigate();
  const [ventas, setVentas] = useState(listSales);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState<number | null>(null);
  const pdfRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      await getSales();
      setLoading(false);
    };
    fetchSales();
  }, [getSales]);

  useEffect(() => {
    setVentas(listSales);
  }, [listSales]);

  const filteredVentas = useMemo(() => {
    return ventas.filter((venta) => {
      const matchesSearch = venta.client?.name
        ? venta.client.name.toLowerCase().includes(search.toLowerCase())
        : search === "";

      const matchesEstado = estadoFilter ? venta.state === estadoFilter : true;

      return matchesSearch && matchesEstado;
    });
  }, [ventas, search, estadoFilter]);

  const getEstadoClase = (estado: string) => {
    switch (estado) {
      case "pagada":
        return "bg-green-200 text-green-800";
      case "pendiente":
        return "bg-yellow-200 text-yellow-800";
      default:
        return "bg-red-200 text-red-800";
    }
  };

  const handleCancelClick = (id: number) => {
    setSelectedSaleId(id);
    setOpenDialog(true);
  };

  const handleConfirmCancel = async () => {
    if (selectedSaleId) {
      try {
        await cancelSale(selectedSaleId);
  
        setVentas((prevVentas) =>
          prevVentas.map((venta) =>
            venta.id === selectedSaleId
              ? { ...venta, state: "cancelada" }
              : venta
          )
        );
  
        // Cierra el diálogo de confirmación
        setOpenDialog(false);
      } catch (error) {
        console.error("Error al cancelar esta venta:", error);
      }
    }
  };

  const exportToPDF = () => {
    const input = pdfRef.current;
    if (!input) return;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 10, imgWidth, imgHeight);
      pdf.save("Historial_de_Ventas.pdf");
    });
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="p-6 mx-auto bg-white shadow-lg rounded-lg" ref={pdfRef}>
      <Typography variant="h4" component="h2" className="mb-4">
        Historial de Ventas
      </Typography>

      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <Input
          placeholder="Buscar por cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-2 py-1 rounded w-full"
          startAdornment={<Search className="text-gray-500" />}
        />
        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel>Estado</InputLabel>
          <Select
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
            label="Estado"
            sx={{ width: "100%", height: 40 }}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="pagada">Pagada</MenuItem>
            <MenuItem value="pendiente">Pendiente</MenuItem>
            <MenuItem value="cancelada">Cancelada</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Download />}
          onClick={exportToPDF}
          sx={{
            padding: "8px 20px",
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: "bold",
            fontSize: "16px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease",
            
          }}
        >
          Exportar
        </Button>
      </Box>

      <Box className="overflow-x-auto">
        <Table className="min-w-full border rounded-lg">
          <TableHead>
            <TableRow className="bg-gray-200">
              <TableCell>ID</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVentas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body1" className="py-5">
                    Aún no se han registrado ventas.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredVentas.map((venta) => (
                <TableRow key={venta.id} className="hover:bg-gray-100">
                  <TableCell>{venta.id}</TableCell>
                  <TableCell>{venta.client?.name ?? ""}</TableCell>
                  <TableCell>${venta.total}</TableCell>
                  <TableCell>
                    {venta.createdAt
                      ? new Date(venta.createdAt).toLocaleString("es-ES", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true,
                        })
                      : "Fecha no disponible"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getEstadoClase(
                        venta.state
                      )}`}
                    >
                      {venta.state.charAt(0).toUpperCase() +
                        venta.state.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      startIcon={<Visibility />}
                      size="small"
                      onClick={async () => {
                        await getSaleById(venta.id ?? 0);
                        navigate(`/ventas/editar`);
                      }}
                    >
                      Ver
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleCancelClick(venta.id ?? 0)}
                      sx={{ ml: 1 }}
                    >
                      Cancelar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Box>

      <ConfirmCancelDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirmCancel}
        title="Confirmar Cancelación"
        message="¿Estás seguro de que deseas cancelar esta venta?"
      />
    </Box>
  );
}
