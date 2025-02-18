import { Navigate, Route, Routes } from "react-router-dom";
import PointOfSale from "../pages/PointOfSale";
import CreateSalePage from "../pages/Sales/CreateSalePage";
import CreateShoppingPage from "../pages/Shopping/CreateShoppingPage";
import AboutPage from "../pages/About/AboutPage";

const PointOfSaleRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PointOfSale />}>
        <Route path="/" element={<CreateSalePage />}></Route>
        <Route path="/compras" element={<CreateShoppingPage />}></Route>
        <Route path="/acerca-de" element={<AboutPage />}></Route>
      </Route>

      <Route path="/*" element={<Navigate to="/" />}></Route>
    </Routes>
  );
};

export default PointOfSaleRoutes;
