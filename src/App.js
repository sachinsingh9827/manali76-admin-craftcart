// src/App.js
import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

// Hooks and Redux
import { useThemeEffect } from "./hooks/useThemeEffect";
import { fetchDashboardStats } from "./redux/dashboardSlice";

// Auth Pages
import Login from "./components/Login/Login";
import SignupPage from "./components/Login/SignupPage";
import ForgetPasswordPage from "./components/Login/ForgotPasswordPage";
import VerifyEmailPage from "./components/Login/VerifyEmailPage";

// Protected and Layout
import ProtectedRoute from "./context/ProtectedRoute";
import AdminLayout from "./Pages/AdminLayout";

// Admin Pages
import AdminDashboard from "./Pages/AdminDashboard";
import Users from "./Pages/Users/Users";
import UserList from "./Pages/Users/UserList";
import EditUser from "./Pages/Users/EditUser";
import Products from "./Pages/Products/Products";
import ProductList from "./Pages/Products/ProductList";
import ProductForm from "./Pages/Products/ProductForm";
import Contact from "./Pages/Contact/ContactPage";
import ContactList from "./Pages/Contact/ContactList";
import ContactInfoForm from "./Pages/Contact/ContactInfoForm";
import Settings from "./Pages/Settings";
import Reports from "./Pages/Reports";

import ScrollToTop from "./components/Reusable/ScrollToTop";
import NotFound from "./utils/NotFound";
import Toast from "./components/Toast/Toast";
import CouponList from "./Pages/Coupon/CouponList";

import Coupon from "./Pages/Coupon/Coupon";
import AddCouponPage from "./Pages/Coupon/AddCouponForm";
import OfferTemplates from "./Pages/Template/OfferTemplates";
import TemplateList from "./Pages/Template/TemplateList";
import TemplateForm from "./Pages/Template/TemplateForm";
import Banner from "./Pages/Banner/Banner";
import BannerList from "./Pages/Banner/BannerList";
import BannerForm from "./Pages/Banner/BannerForm";
import ProductVideos from "./Pages/Video/Video";
import VideoList from "./Pages/Video/VideoList";
import UploadVideoForm from "./Pages/Video/UploadVideoForm";
import Orders from "./Pages/Orders/Order";
import OrderList from "./Pages/Orders/OrderList";
import EditOrder from "./Pages/Orders/ViewOrder";
import Reviews from "./Pages/Reviews/Reviews";
import ReviewList from "./Pages/Reviews/ReviewList";
import EditReview from "./Pages/Reviews/EditReview";
import Unauthorized from "./components/Reusable/Unauthorized";

function App() {
  useThemeEffect();
  const location = useLocation();
  const dispatch = useDispatch();

  // ✅ Fetch dashboard stats only once on app load
  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  // Optional: Handle unknown routes outside allowed paths
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
        <Route path="/unauthorized" element={<Unauthorized />} />
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
          </Route>
          <Route path="orders" element={<Orders />}>
            <Route index element={<OrderList />} />
            <Route path="edit/:id" element={<EditOrder />} />
          </Route>

          <Route path="products" element={<Products />}>
            <Route index element={<ProductList />} />
            <Route path="new" element={<ProductForm />} />
            <Route path=":id" element={<ProductForm />} />
          </Route>
          <Route path="contact" element={<Contact />}>
            <Route index element={<ContactList />} />
            <Route path="edit/:id?" element={<ContactInfoForm />} />
          </Route>
          <Route path="coupon" element={<Coupon />}>
            <Route index element={<CouponList />} />
            <Route path="edit/:id?" element={<AddCouponPage />} />
          </Route>
          <Route path="templates" element={<OfferTemplates />}>
            <Route index element={<TemplateList />} />
            <Route path="new" element={<TemplateForm />} />
            <Route path=":id" element={<TemplateForm />} />
          </Route>
          <Route path="banners" element={<Banner />}>
            <Route index element={<BannerList />} />
            <Route path="new" element={<BannerForm />} />
            <Route path=":id" element={<BannerForm />} />
          </Route>
          <Route path="videos" element={<ProductVideos />}>
            <Route index element={<VideoList />} />
            <Route path="new" element={<UploadVideoForm />} />
            <Route path=":id" element={<UploadVideoForm />} />
          </Route>
          <Route path="reviews" element={<Reviews />}>
            <Route index element={<ReviewList />} />
            <Route path="edit/:id" element={<EditReview />} />
          </Route>

          <Route path="settings" element={<Settings />} />
          <Route path="reports" element={<Reports />} />
        </Route>

        {/* Catch All */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
