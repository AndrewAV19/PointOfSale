import { Route, Routes } from "react-router-dom"
import AuthRoutes from "../auth/routes/AuthRoutes"
import PointOfSaleRoutes from "../pointofsale/routes/PointOfSaleRoutes"

const AppRouter = () => {
  return (
    <Routes>

        {/* Login y Registro */}
        <Route path="/auth/*" element={ <AuthRoutes/> }/>

        {/* Punto de venta */}
        <Route path="/*" element={ <PointOfSaleRoutes/> }/>
      
    </Routes>
  )
}

export default AppRouter
