import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useThemeEffect } from "./hooks/useThemeEffect";
import Login from "./components/Login/Login";
import SignupPage from "./components/Login/SignupPage";
import ForgetPasswordPage from "./components/Login/ForgotPasswordPage";
import VerifyEmailPage from "./components/Login/VerifyEmailPage";
import ProtectedRoute from "./context/ProtectedRoute";
import AdminLayout from "./Pages/AdminLayout";
import AdminDashboard from "./Pages/AdminDashboard";
import Users from "./Pages/Users/Users";
import UserList from "./Pages/Users/UserList";
import EditUser from "./Pages/Users/EditUser";
import Orders from "./Pages/Users/Orders";
import Settings from "./Pages/Settings";
import Reports from "./Pages/Reports";
import Toast from "./components/Toast/Toast";

import NotFound from "./utils/NotFound";
import ContactPage from "./Pages/Contact/ContactPage";
import Products from "./Pages/Products/Products";
import ProductList from "./Pages/Products/ProductList";
import ProductForm from "./Pages/Products/ProductForm";
import ScrollToTop from "./components/Reusable/ScrollToTop";
import ContactList from "./Pages/Contact/ContactList";
import Contact from "./Pages/Contact/ContactPage";
import ContactInfoForm from "./Pages/Contact/ContactInfoForm";

function App() {
  useThemeEffect();
  const location = useLocation();

  // Optional unknown route detection you can keep or remove
  const isNotFound =
    location.pathname !== "/" &&
    !["/", "/signup", "/verify-email", "/forget-password"].some((path) =>
      location.pathname.startsWith(path)
    ) &&
    !/^\/admin(\/.*)?$/.test(location.pathname);

  if (isNotFound) return <NotFound />;

  return (
    <div className="App min-h-screen transition-colors duration-300">
      <Toast />
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forget-password" element={<ForgetPasswordPage />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<Users />}>
            <Route index element={<UserList />} />
            <Route path="edit/:id" element={<EditUser />} />
            <Route path="orders" element={<Orders />} />
          </Route>
          <Route path="/admin/products" element={<Products />}>
            <Route index element={<ProductList />} />
            <Route path="new" element={<ProductForm />} />
            <Route path=":id" element={<ProductForm />} />
          </Route>
          <Route path="contact" element={<Contact />}>
            <Route index element={<ContactList />} /> {/* /admin/contact */}
            <Route path="edit/:id?" element={<ContactInfoForm />} />{" "}
            {/* /admin/contact/edit or /admin/contact/edit/:id */}
          </Route>

          <Route path="settings" element={<Settings />} />
          <Route path="reports" element={<Reports />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
