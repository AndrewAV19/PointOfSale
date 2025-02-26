import { useEffect, useState } from "react";
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

import ConfirmDialog from "../../../components/ConfirmDeleteModal";
import { dataStore } from "../../../stores/generalData.store";
import { storeClients } from "../../../stores/clients.store";

export default function HistoryClients() {
  const { listClients, getClients, deleteClient } = storeClients();
  const { getUserById } = dataStore();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [clients, setClients] = useState(listClients);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);

  useEffect(() => {
    getClients();
  }, [getClients]);

  useEffect(() => {
    setClients(listClients);
  }, [listClients]);

  const filteredVentas = clients.filter((cliente) =>
    cliente?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteClick = (id: number) => {
    setSelectedClientId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedClientId) {
      try {
        await deleteClient(selectedClientId);
        setClients(clients.filter((user) => user.id !== selectedClientId));
        setOpenDialog(false);
      } catch (error) {
        console.error("Error al eliminar el cliente:", error);
      }
    }
  };

  return (
    <div className="p-6 mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Historial de Clientes</h2>

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
              <TableCell>Email</TableCell>
              <TableCell>Telefono</TableCell>
              <TableCell>Direccion</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVentas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <div
                    style={{
                      padding: "20px",
                      fontSize: "16px",
                      textAlign: "center",
                    }}
                  >
                    Aún no se han agregado clientes.
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredVentas.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-100">
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.address}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      startIcon={<Visibility />}
                      size="small"
                      onClick={async () => {
                        await getUserById(user.id);
                        navigate(`/clientes/editar`);
                      }}
                    >
                      Ver
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDeleteClick(user.id)}
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
        message="¿Estás seguro de que deseas eliminar este cliente?"
      />
    </div>
  );
}
