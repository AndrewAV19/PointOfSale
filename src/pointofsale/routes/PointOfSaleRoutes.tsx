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
import HistoryProducts from "../pages/Inventory/HistoryProducts";
import AddCategory from "../pages/Categories/AddCategory";
import HistoryCategories from "../pages/Categories/HistoryCategories";
import AddClient from "../pages/Clients/AddClient";
import AddSupplier from "../pages/Suppliers/AddSupplier";
import AddUser from "../pages/Users/AddUserPage";
import HistoryUsers from "../pages/Users/HistoryUsers";
import EditUserPage from "../pages/Users/EditUserPage";

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
        <Route path="/inventario/productos/historial" element={<HistoryProducts />}></Route>

        <Route path="/inventario/categorias/agregar" element={<AddCategory />}></Route>
        <Route path="/inventario/categorias/historial" element={<HistoryCategories />}></Route>

        <Route path="/clientes/agregar" element={<AddClient />}></Route>

        <Route path="/proveedores/agregar" element={<AddSupplier />}></Route>

        <Route path="/usuarios/agregar" element={<AddUser />}></Route>
        <Route path="/usuarios/historial" element={<HistoryUsers />}></Route>
        <Route path="/usuarios/editar" element={<EditUserPage />}></Route>

        <Route path="/acerca-de" element={<AboutPage />}></Route>
      </Route>

      <Route path="/*" element={<Navigate to="/" />}></Route>
    </Routes>
  );
};

export default PointOfSaleRoutes;
