import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Cuộn về đầu trang
  }, [pathname]);

  return null; // Component này không render gì
};

export default ScrollToTop;