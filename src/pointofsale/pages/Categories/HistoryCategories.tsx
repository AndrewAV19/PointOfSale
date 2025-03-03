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
import { storeCategories } from "../../../stores/categories.store";

export default function HistoryCategories() {
  const { listCategories, getCategories, deleteCategory } = storeCategories();
  const { getCategoryById } = dataStore();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [categories, setCategories] = useState(listCategories);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const pdfRef = useRef(null);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  useEffect(() => {
    setCategories(listCategories);
  }, [listCategories]);

  const filteredCategories = categories.filter((category) =>
    category?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteClick = (id: number) => {
    setSelectedCategoryId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedCategoryId) {
      try {
        await deleteCategory(selectedCategoryId);
        setCategories(
          categories.filter((category) => category.id !== selectedCategoryId)
        );
        setOpenDialog(false);
      } catch (error) {
        console.error("Error al eliminar la categoría:", error);
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
      pdf.save("Historial_de_Categorias.pdf");
    });
  };

  return (
    <div className="p-6 mx-auto bg-white shadow-lg rounded-lg" ref={pdfRef}>
      <h2 className="text-2xl font-bold mb-4">Historial de Categorías</h2>

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
              <TableCell>Descripción</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <div
                    style={{
                      padding: "20px",
                      fontSize: "16px",
                      textAlign: "center",
                    }}
                  >
                    Aún no se han agregado categorías.
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories.map((category) => (
                <TableRow key={category.id} className="hover:bg-gray-100">
                  <TableCell>{category.id}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    {category.description ?? "Sin descripción"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      startIcon={<Visibility />}
                      size="small"
                      onClick={async () => {
                        await getCategoryById(category.id ?? 0);
                        navigate(`/inventario/categorias/editar`);
                      }}
                    >
                      Ver
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDeleteClick(category.id ?? 0)}
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
        message="¿Estás seguro de que deseas eliminar esta categoría?"
      />
    </div>
  );
}
