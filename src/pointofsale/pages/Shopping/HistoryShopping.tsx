import { useRef, useState } from "react";
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
import { compras as initialShopping } from "../../mocks/historyShopping";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../../../components/ConfirmDeleteModal";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function HistoryShopping() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [compras, setCompras] = useState(initialShopping);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedShoppingId, setSelectedShoppingId] = useState<
    string | number | null
  >(null);
  const pdfRef = useRef(null);

  console.log(setSelectedShoppingId);

  const filteredCompras = compras.filter((compra) =>
    compra.proveedor.toLowerCase().includes(search.toLowerCase())
  );

  const getEstadoClase = (estado: string) => {
    switch (estado) {
      case "Completado":
        return "bg-green-200 text-green-800";
      case "Pendiente":
        return "bg-yellow-200 text-yellow-800";
      default:
        return "bg-red-200 text-red-800";
    }
  };

  const handleDeleteClick = (id: string | number) => {
    setSelectedShoppingId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    setCompras(compras.filter((p) => p.id !== selectedShoppingId));
    setOpenDialog(false);
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
      pdf.save("Historial_de_Compras.pdf");
    });
  };

  return (
    <div className="p-6 mx-auto bg-white shadow-lg rounded-lg" ref={pdfRef}>
      <h2 className="text-2xl font-bold mb-4">Historial de Compras</h2>

      <div className="flex items-center gap-2 mb-4">
        <Input
          placeholder="Buscar por proveedor..."
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
              <TableCell>Proveedor</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCompras.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <div
                    style={{
                      padding: "20px",
                      fontSize: "16px",
                      textAlign: "center",
                    }}
                  >
                    Aún no se han registrado compras.
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredCompras.map((compra) => (
                <TableRow key={compra.id} className="hover:bg-gray-100">
                  <TableCell>{compra.id}</TableCell>
                  <TableCell>{compra.proveedor}</TableCell>
                  <TableCell>{compra.total}</TableCell>
                  <TableCell>{compra.fecha}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getEstadoClase(
                        compra.estado
                      )}`}
                    >
                      {compra.estado}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      startIcon={<Visibility />}
                      size="small"
                      onClick={() => navigate(`/compras/editar`)}
                    >
                      Ver
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDeleteClick(compra.id)}
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
        message="¿Estás seguro de que deseas eliminar esta compra?"
      />
    </div>
  );
}
