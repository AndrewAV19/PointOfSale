import { Navigate, Route, Routes } from "react-router-dom";
import PointOfSale from "../pages/PointOfSale";
import CreateSalePage from "../pages/Sales/CreateSalePage";
import CreateShoppingPage from "../pages/Shopping/CreateShoppingPage";
import AboutPage from "../pages/About/AboutPage";
import HistorySales from "../pages/Sales/HistorySales";
import HistoryShopping from "../pages/Shopping/HistoryShopping";

const PointOfSaleRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PointOfSale />}>
        <Route path="/" element={<CreateSalePage />}></Route>
        <Route path="/ventas/historial" element={<HistorySales />}></Route>
        <Route path="/compras" element={<CreateShoppingPage />}></Route>
        <Route path="/compras/historial" element={<HistoryShopping />}></Route>
        <Route path="/acerca-de" element={<AboutPage />}></Route>
      </Route>

      <Route path="/*" element={<Navigate to="/" />}></Route>
    </Routes>
  );
};

export default PointOfSaleRoutes;
