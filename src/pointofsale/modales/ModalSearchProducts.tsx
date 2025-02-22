import { Close as CloseIcon, Search as SearchIcon } from "@mui/icons-material";
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useState } from "react";
import { ProductTable } from "../tables/ProductTable";
import { products } from "../mocks/productMock";

interface ModalSearchToProductsProps {
  open: boolean;
  handleClose: () => void;
  handleSelect: (item: any) => void;
  showPrice: boolean;
}

export const ModalSearchProducts: React.FC<ModalSearchToProductsProps> = ({
  open,
  handleClose,
  handleSelect,
  showPrice,
}) => {

  const [search, setSearch] = useState("");

  // Filtrar productos según el texto de búsqueda
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">
          Seleccionar Producto
        </Typography>
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {/* Campo de búsqueda */}
        <TextField
          fullWidth
          placeholder="Buscar producto..."
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ marginBottom: 2 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
        />
        
        <ProductTable products={filteredProducts} onSelect={(product) => {
          handleSelect(product);
          handleClose();
        }} 
        showPrice={showPrice}
        />

      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary" variant="outlined">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
