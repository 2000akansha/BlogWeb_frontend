import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const useAuthGuard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/");
      return;
    }
    // If token is present, proceed with API calls
  }, [navigate]);
};

export default useAuthGuard;