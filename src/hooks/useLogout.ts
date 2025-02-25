import { useNavigate } from "react-router-dom";

const useLogout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    localStorage.removeItem("loginTime"); 
    navigate("/auth/login"); 
  };

  return handleLogout;
};

export default useLogout;