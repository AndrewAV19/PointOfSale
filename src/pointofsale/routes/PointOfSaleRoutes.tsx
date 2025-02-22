import { Navigate, Route, Routes } from "react-router-dom";
import PointOfSale from "../pages/PointOfSale";
import CreateSalePage from "../pages/Sales/CreateSalePage";
import CreateShoppingPage from "../pages/Shopping/CreateShoppingPage";
import AboutPage from "../pages/About/AboutPage";
import HistorySales from "../pages/Sales/HistorySales";
import HistoryShopping from "../pages/Shopping/HistoryShopping";
import EditSalePage from "../pages/Sales/EditSalePage";
import EditShoppingPage from "../pages/Shopping/EditShoppingPage";
import AddProduct from "../pages/Inventory/AddProduct";

const PointOfSaleRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PointOfSale />}>
        <Route path="/" element={<CreateSalePage />}></Route>
        <Route path="/ventas/historial" element={<HistorySales />}></Route>
        <Route path="/ventas/editar" element={<EditSalePage />}></Route>

        <Route path="/compras" element={<CreateShoppingPage />}></Route>
        <Route path="/compras/historial" element={<HistoryShopping />}></Route>
        <Route path="/compras/editar" element={<EditShoppingPage />}></Route>

        <Route path="/inventario/productos/agregar" element={<AddProduct />}></Route>

        <Route path="/acerca-de" element={<AboutPage />}></Route>
      </Route>

      <Route path="/*" element={<Navigate to="/" />}></Route>
    </Routes>
  );
};

export default PointOfSaleRoutes;
