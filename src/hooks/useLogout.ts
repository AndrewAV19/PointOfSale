import { useNavigate } from "react-router-dom";

const useLogout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    localStorage.removeItem("loginTime"); 
    localStorage.removeItem("roles"); 
    localStorage.removeItem("users-data"); 
    localStorage.removeItem("clients-data"); 
    localStorage.removeItem("suppliers-data"); 
    localStorage.removeItem("products-data"); 
    localStorage.removeItem("categories-data"); 
    localStorage.removeItem("sales-data"); 
    localStorage.removeItem("income-data"); 
    localStorage.removeItem("shoppings-data"); 
    localStorage.removeItem("id_usuario"); 
    localStorage.removeItem("name_usuario"); 
    navigate("/auth/login"); 
  };

  return handleLogout;
};

export default useLogout;