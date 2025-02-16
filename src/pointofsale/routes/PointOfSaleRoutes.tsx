import { Navigate, Route, Routes } from "react-router-dom"
import PointOfSale from "../pages/PointOfSale"


const PointOfSaleRoutes = () => {
  return (
    <Routes>
      
      <Route path="/" element={ <PointOfSale/> }/>

      <Route path="/*" element={ <Navigate to="/"/> }/>

    </Routes>
  )
}

export default PointOfSaleRoutes
