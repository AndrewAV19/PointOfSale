import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableHead, TableRow, TableCell, TableBody, Input, Button } from "@mui/material";
import { Search, Visibility, Download } from "@mui/icons-material";
import { products } from "../../mocks/historyProductsMock";

export default function HistoryProducts() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate(); 

  const filteredProducts = products.filter((venta) =>
    venta.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Historial de Productos</h2>

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
              <TableCell>Categoría</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell></TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((venta) => (
              <TableRow key={venta.id} className="hover:bg-gray-100">
                <TableCell>{venta.id}</TableCell>
                <TableCell>{venta.name}</TableCell>
                <TableCell>{venta.category.name}</TableCell>
                <TableCell>{venta.price}</TableCell>
                <TableCell>{venta.stock}</TableCell>
                <TableCell>{venta.photo}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    startIcon={<Visibility />}
                    size="small"
                    onClick={() => navigate(`/inventario/productos/editar`)} 
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
