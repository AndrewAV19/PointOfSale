import { useState } from "react";
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
import { categories as initialCategories} from '../../mocks/categoriesMock';
import ConfirmDialog from "../../../components/ConfirmDeleteModal";

export default function HistoryCategories() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [categories, setCategories] = useState(initialCategories);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | number | null
  >(null);

  console.log(setSelectedCategoryId);

  // Filtrar productos según la búsqueda
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  // Función para eliminar un producto
  const handleDeleteClick = (id: string | number) => {
    setSelectedCategoryId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    setCategories(categories.filter((p) => p.id !== selectedCategoryId));
    setOpenDialog(false);
  };

  return (
    <div className="p-6 mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Historial de Categorías</h2>

      <div className="flex items-center gap-2 mb-4">
        <Input
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-2 py-1 rounded w-full"
          startAdornment={<Search className="text-gray-500" />}
        />
        <Button variant="contained" color="primary" startIcon={<Download />}>
          Exportar
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-full border rounded-lg">
          <TableHead>
            <TableRow className="bg-gray-200">
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripcion</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCategories.map((category) => (
              <TableRow key={category.id} className="hover:bg-gray-100">
                <TableCell>{category.id}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    startIcon={<Visibility />}
                    size="small"
                    onClick={() =>
                      navigate(`/inventario/categorias/editar/${category.id}`)
                    }
                  >
                    Ver
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDeleteClick(category.id)}
                    sx={{ ml: 1 }}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
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
