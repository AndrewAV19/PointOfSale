import { useEffect, useRef, useState } from "react";
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
import { dataStore } from "../../../stores/generalData.store";
import { storeSuppliers } from "../../../stores/suppliers.store";

export default function HistorySuppliers() {
  const { listSuppliers, getSuppliers, deleteSupplier } = storeSuppliers();
  const { getSupplierById } = dataStore();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState(listSuppliers);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSupplierId, setselectedSupplierId] = useState<number | null>(
    null
  );
  const pdfRef = useRef(null);

  useEffect(() => {
    getSuppliers();
  }, [getSuppliers]);

  useEffect(() => {
    setSuppliers(listSuppliers);
  }, [listSuppliers]);

  const filteredProveedores = suppliers.filter((proveedor) =>
    proveedor?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteClick = (id: number) => {
    setselectedSupplierId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedSupplierId) {
      try {
        await deleteSupplier(selectedSupplierId);
        setSuppliers(
          suppliers.filter((proveedor) => proveedor.id !== selectedSupplierId)
        );
        setOpenDialog(false);
      } catch (error) {
        console.error("Error al eliminar el proveedor:", error);
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
      pdf.save("Historial_de_Proveedores.pdf");
    });
  };

  return (
    <div className="p-6 mx-auto bg-white shadow-lg rounded-lg" ref={pdfRef}>
      <h2 className="text-2xl font-bold mb-4">Historial de Proveedores</h2>

      <div className="flex items-center gap-2 mb-4">
        <Input
          placeholder="Buscar por nombre..."
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
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefono</TableCell>
              <TableCell>Direccion</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProveedores.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <div
                    style={{
                      padding: "20px",
                      fontSize: "16px",
                      textAlign: "center",
                    }}
                  >
                    Aún no se han agregado proveedores.
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredProveedores.map((proveedor) => (
                <TableRow key={proveedor.id} className="hover:bg-gray-100">
                  <TableCell>{proveedor.id}</TableCell>
                  <TableCell>{proveedor.name}</TableCell>
                  <TableCell>{proveedor.email}</TableCell>
                  <TableCell>{proveedor.phone}</TableCell>
                  <TableCell>{proveedor.address}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      startIcon={<Visibility />}
                      size="small"
                      onClick={async () => {
                        await getSupplierById(proveedor.id ?? 0);
                        navigate(`/proveedores/editar`);
                      }}
                    >
                      Ver
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDeleteClick(proveedor.id ?? 0)}
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
        message="¿Estás seguro de que deseas eliminar este proveedor?"
      />
    </div>
  );
}
