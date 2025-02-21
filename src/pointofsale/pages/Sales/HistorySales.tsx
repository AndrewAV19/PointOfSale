import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableHead, TableRow, TableCell, TableBody, Input, Button } from "@mui/material";
import { Search, Visibility, Download } from "@mui/icons-material";
import { ventas } from "../../mocks/historySalesMock";

export default function HistorySales() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate(); 

  const filteredVentas = ventas.filter((venta) =>
    venta.cliente.toLowerCase().includes(search.toLowerCase())
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

  return (
    <div className="p-6 mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Historial de Ventas</h2>

      <div className="flex items-center gap-2 mb-4">
        <Input
          placeholder="Buscar por cliente..."
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
              <TableCell>Cliente</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVentas.map((venta) => (
              <TableRow key={venta.id} className="hover:bg-gray-100">
                <TableCell>{venta.id}</TableCell>
                <TableCell>{venta.cliente}</TableCell>
                <TableCell>{venta.total}</TableCell>
                <TableCell>{venta.fecha}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getEstadoClase(
                      venta.estado
                    )}`}
                  >
                    {venta.estado}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    startIcon={<Visibility />}
                    size="small"
                    onClick={() => navigate(`/ventas/editar`)} 
                  >
                    Ver
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
