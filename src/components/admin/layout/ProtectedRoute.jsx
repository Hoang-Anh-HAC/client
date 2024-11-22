import React from "react";
import { Navigate } from "react-router-dom";
import { ADMIN_RANDOM_CODE_URL } from "../../../constants/adminConstants";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem("adminToken");

  // Nếu không có token, điều hướng về trang login
  if (!isLoggedIn) {
    return <Navigate to={`${ADMIN_RANDOM_CODE_URL}/admin-login`} replace />;
  }

  return children; // Trả về children nếu có token
};

export default ProtectedRoute;
