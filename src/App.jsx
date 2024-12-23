import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ADMIN_RANDOM_CODE_URL } from "./constants/adminConstants";
import { DataProvider } from "./contexts/DataContext";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

// Admin Pages
import LoginAdmin from "./pages/admin/auth/LoginAdmin";
import HomeAdmin from "./pages/admin/dashboard/HomeAdmin";
import {
  ManageProduct,
  AddProduct,
  EditProduct,
  ViewProduct,
} from "./pages/admin/products";
import ManageBrand from "./pages/admin/brands/ManageBrand";
import ManageCategory from "./pages/admin/categories/ManageCategory";
import ManageFilter from "./pages/admin/filters/ManageFilter";
import ManageForm from "./pages/admin/resform/ManageForm";
import ManageSeries from "./pages/admin/series/ManageSeries";

// User Pages
import HomePage from "./pages/user/HomePage";
import ProductList from "./pages/user/ProductList";
import ProductDetail from "./pages/user/ProductDetail";
import About from "./pages/user/About";
import Contact from "./pages/user/Contact";

// Components
import ProtectedRoute from "./components/admin/layout/ProtectedRoute";
import ScrollToTop from "./components/user/ScrollToTop";

// Routes Configuration
const userRoutes = [
  { path: "/", element: <HomePage /> },
  { path: "product-list/:categorySlug/:brandSlug?", element: <ProductList /> },
  { path: "product/:slug", element: <ProductDetail /> },
  { path: "about", element: <About /> },
  { path: "contact", element: <Contact /> },
];

const adminRoutes = [
  { path: "home-admin", element: <HomeAdmin /> },
  { path: "manage-product", element: <ManageProduct /> },
  { path: "manage-category", element: <ManageCategory /> },
  { path: "manage-brand", element: <ManageBrand /> },
  { path: "manage-option", element: <ManageFilter /> },
  { path: "manage-series", element: <ManageSeries /> },
  { path: "form", element: <ManageForm /> },
  { path: "manage-product/add-product", element: <AddProduct /> },
  { path: "manage-product/product/:productSlug", element: <EditProduct /> },
  {
    path: "manage-product/product/view/:productSlug",
    element: <ViewProduct />,
  },
];

function App() {
  const isLoggedIn = !!localStorage.getItem("adminToken");

  return (
    <DataProvider>
      <ScrollToTop />

      <Routes>
        {/* User Routes */}
        <Route path="/" element={<MainLayout />}>
          {userRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>

        {/* Admin Login */}
        <Route
          path={`/${ADMIN_RANDOM_CODE_URL}/admin-login`}
          element={
            isLoggedIn ? (
              <Navigate to={`/${ADMIN_RANDOM_CODE_URL}/home-admin`} />
            ) : (
              <LoginAdmin />
            )
          }
        />

        {/* Admin Routes */}
        <Route
          path={ADMIN_RANDOM_CODE_URL}
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {adminRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>
      </Routes>
    </DataProvider>
  );
}

export default App;
