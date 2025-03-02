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
import HistoryClients from "../pages/Clients/HistoryClients";
import EditClientPage from "../pages/Clients/EditClientPage";
import HistorySuppliers from "../pages/Suppliers/HistorySuppliers";
import EditSupplierPage from "../pages/Suppliers/EditSupplierPage";
import EditCategoryPage from "../pages/Categories/EditCategoryPage";
import DailyIncome from "../pages/income/DailyIncome";
import MonthlyIncome from "../pages/income/MonthlyIncome";
import YearlyIncome from "../pages/income/YearlyIncome";
import DailyExpenses from "../pages/expenses/DailyExpenses";
import MonthlyExpenses from "../pages/expenses/MonthlyExpenses";
import YearlyExpenses from "../pages/expenses/YearlyExpenses";
import PendingPaymentsClientsHistory from "../pages/Clients/PendingPaymentsClientsHistory";
import PendingPaymentsClient from "../pages/Clients/PendingPaymentsClient";

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
        <Route path="/inventario/categorias/editar" element={<EditCategoryPage />}></Route>

        <Route path="/clientes/agregar" element={<AddClient />}></Route>
        <Route path="/clientes/historial" element={<HistoryClients />}></Route>
        <Route path="/clientes/editar" element={<EditClientPage />}></Route>
        <Route path="/clientes/pagos-pendientes" element={<PendingPaymentsClientsHistory />}></Route>
        <Route path="/clientes/editar/pagos-pendientes" element={<PendingPaymentsClient />}></Route>        

        <Route path="/proveedores/agregar" element={<AddSupplier />}></Route>
        <Route path="/proveedores/historial" element={<HistorySuppliers />}></Route>
        <Route path="/proveedores/editar" element={<EditSupplierPage />}></Route>

        <Route path="/usuarios/agregar" element={<AddUser />}></Route>
        <Route path="/usuarios/historial" element={<HistoryUsers />}></Route>
        <Route path="/usuarios/editar" element={<EditUserPage />}></Route>

        <Route path="/ingresos/dia" element={<DailyIncome />}></Route>
        <Route path="/ingresos/mes" element={<MonthlyIncome />}></Route>
        <Route path="/ingresos/anio" element={<YearlyIncome />}></Route>

        <Route path="/egresos/dia" element={<DailyExpenses />}></Route>
        <Route path="/egresos/mes" element={<MonthlyExpenses />}></Route>
        <Route path="/egresos/anio" element={<YearlyExpenses />}></Route>
        
        <Route path="/acerca-de" element={<AboutPage />}></Route>
      </Route>

      <Route path="/*" element={<Navigate to="/" />}></Route>
    </Routes>
  );
};

export default PointOfSaleRoutes;
