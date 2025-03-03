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
import { storeProducts } from "../../../stores/products.store";
import { dataStore } from "../../../stores/generalData.store";

export default function HistoryProducts() {
  const { listProducts, getProducts, deleteProduct } = storeProducts();
  const { getProductById } = dataStore();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [products, setProducts] = useState(listProducts);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  useEffect(() => {
    setProducts(listProducts);
  }, [listProducts]);

  // Filtrar productos según la búsqueda
  const filteredProducts = products.filter((venta) =>
    venta.name.toLowerCase().includes(search.toLowerCase())
  );

  // Función para eliminar un producto
  const handleDeleteClick = (id: number) => {
    setSelectedProductId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedProductId) {
      try {
        await deleteProduct(selectedProductId);
        setProducts(
          products.filter((product) => product.id !== selectedProductId)
        );
        setOpenDialog(false);
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
      }
    }
  };

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
              <TableCell>Foto</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <div
                    style={{
                      padding: "20px",
                      fontSize: "16px",
                      textAlign: "center",
                    }}
                  >
                    Aún no se han registrado productos.
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((producto) => (
                <TableRow key={producto.id} className="hover:bg-gray-100">
                  <TableCell>{producto.id}</TableCell>
                  <TableCell>{producto.name}</TableCell>
                  <TableCell>{producto.category?.name}</TableCell>
                  <TableCell>{producto.price}</TableCell>
                  <TableCell>{producto.stock}</TableCell>
                  <TableCell>{producto.images}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      startIcon={<Visibility />}
                      size="small"
                      onClick={async () => {
                        await getProductById(producto.id ?? 0);
                        navigate(`/inventario/productos/editar`);
                      }}
                    >
                      Ver
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDeleteClick(producto.id ?? 0)}
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
        message="¿Estás seguro de que deseas eliminar este producto?"
      />
    </div>
  );
}
