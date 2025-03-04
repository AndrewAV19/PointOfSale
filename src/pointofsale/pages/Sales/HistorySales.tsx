import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Input,
  Button,
} from "@mui/material";
import { Search, Visibility, Download } from "@mui/icons-material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ConfirmDialog from "../../../components/ConfirmDeleteModal";
import { storeSales } from "../../../stores/sales.store";
import { dataStore } from "../../../stores/generalData.store";

export default function HistorySales() {
  const { listSales, getSales, deleteSale } = storeSales();
  const { getSaleById } = dataStore();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [ventas, setVentas] = useState(listSales);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState<number | null>(null);
  const pdfRef = useRef(null);

  useEffect(() => {
    getSales();
  }, [getSales]);

  useEffect(() => {
    setVentas(listSales);
  }, [listSales]);

  const filteredVentas = ventas.filter((venta) =>
    venta.client?.name
      ? venta.client.name.toLowerCase().includes(search.toLowerCase())
      : search === ""
  );

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

  const handleDeleteClick = (id: number) => {
    setSelectedSaleId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedSaleId) {
      try {
        await deleteSale(selectedSaleId);
        setVentas(ventas.filter((venta) => venta.id !== selectedSaleId));
        setOpenDialog(false);
      } catch (error) {
        console.error("Error al eliminar esta venta:", error);
      }
    }
  };

  // Función para exportar la vista a PDF
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

  return (
    <div className="p-6 mx-auto bg-white shadow-lg rounded-lg"  ref={pdfRef}>
      <h2 className="text-2xl font-bold mb-4">Historial de Ventas</h2>

      <div className="flex items-center gap-2 mb-4">
        <Input
          placeholder="Buscar por cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-2 py-1 rounded w-full"
          startAdornment={<Search className="text-gray-500" />}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<Download />}
          onClick={exportToPDF}
        >
          Exportar
        </Button>
      </div>

      <div className="overflow-x-auto">
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
                  <div
                    style={{
                      padding: "20px",
                      fontSize: "16px",
                      textAlign: "center",
                    }}
                  >
                    Aún no se han registrado ventas.
                  </div>
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
                      onClick={() => handleDeleteClick(venta.id ?? 0)}
                      sx={{ ml: 1 }}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal de Confirmación */}
      <ConfirmDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que deseas eliminar esta venta?"
      />
    </div>
  );
}
