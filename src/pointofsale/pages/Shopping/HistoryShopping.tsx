import { useState } from "react";
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

export default function HistoryShopping() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [compras, setCompras] = useState(initialShopping);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedShoppingId, setSelectedShoppingId] = useState<string | number | null>(null);

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

  return (
    <div className="p-6 mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Historial de Compras</h2>

      <div className="flex items-center gap-2 mb-4">
        <Input
          placeholder="Buscar por proveedor..."
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
              <TableCell>Proveedor</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCompras.map((compra) => (
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
        message="¿Estás seguro de que deseas eliminar esta compra?"
      />
    </div>
  );
}
