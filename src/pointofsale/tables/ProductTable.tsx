import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, Typography } from "@mui/material";
import { Product } from '../interfaces/product.interface';

interface ProductListProps {
  products: Product[];
  onSelect: (product: Product) => void;
  showPrice: boolean; // Prop para decidir qué valor mostrar
}

export const ProductTable: React.FC<ProductListProps> = ({ products, onSelect, showPrice }) => {
  return (
    <TableContainer component={Paper} elevation={3}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>{showPrice ? 'Precio' : 'Costo'}</TableCell> 
            <TableCell align="center">Acción</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.length > 0 ? (
            products.map((product) => (
              <TableRow key={product.id} hover>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{showPrice ? product.price : product.costPrice}</TableCell> {/* Mostrar precio o costo */}
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => onSelect(product)}
                  >
                    Seleccionar
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} align="center">
                <Typography color="textSecondary">No se encontraron resultados</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
