import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PreventBack = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handlePopState = (event) => {
      if (!localStorage.getItem("authToken")) {
        navigate("/", { replace: true });
      }
    };
    
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  return null;
};

export default PreventBack;
