import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Button from "../../components/Reusable/Button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CouponDetails from "./CouponDetails";

const BASE_URL = "https://craft-cart-backend.vercel.app";

const DeleteConfirmModal = ({ visible, title, onCancel, onConfirm }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-md shadow-lg max-w-sm w-full p-6 text-center">
        <h3 className="text-lg font-semibold mb-4 dark:text-gray-200">
          {title}
        </h3>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          Are you sure you want to delete this item? This action cannot be
          undone.
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="secondary" onClick={onCancel} className="px-6 py-2">
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 px-6 py-2"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

const AddCouponPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCoupon, setLoadingCoupon] = useState(false);

  const [initialValues, setInitialValues] = useState({
    couponName: "",
    couponCode: "",
    discount: "",
    maxAllowed: "",
    productId: "",
    expiryDate: "",
    description: "",
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [couponActive, setCouponActive] = useState(true); // assume active by default

  useEffect(() => {
    // Fetch active products for the dropdown
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const res = await axios.get(
          `${BASE_URL}/api/admin/protect/active-summaries`
        );
        if (res.data.success) {
          setProducts(res.data.data);
        } else {
          toast.error("Failed to load products");
        }
      } catch (err) {
        toast.error("Error loading products");
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch coupon details if editing
  useEffect(() => {
    if (!id) return;

    const fetchCoupon = async () => {
      try {
        setLoadingCoupon(true);
        const res = await axios.get(`${BASE_URL}/api/coupons/${id}`);
        if (res.data.success && res.data.data) {
          const c = res.data.data;
          setInitialValues({
            couponName: c.name || "",
            couponCode: c.code || "",
            discount: c.discountPercentage || "",
            maxAllowed: c.maxDiscount || "",
            productId: c.product?._id || "",
            expiryDate: c.expiryDate ? c.expiryDate.split("T")[0] : "",
            description: c.description || "",
          });
          setCouponActive(c.isActive);
        } else {
          toast.error("Failed to load coupon data");
        }
      } catch (err) {
        toast.error("Error fetching coupon");
      } finally {
        setLoadingCoupon(false);
      }
    };

    fetchCoupon();
  }, [id]);

  const validationSchema = Yup.object({
    couponName: Yup.string().required("Coupon name is required"),
    couponCode: Yup.string().required("Coupon code is required"),
    productId: Yup.string().required("Please select a product"),
    discount: Yup.number()
      .required("Discount is required")
      .min(1, "Discount must be at least 1%")
      .max(100, "Discount cannot exceed 100%"),
    maxAllowed: Yup.number()
      .required("Max discount amount is required")
      .min(0, "Max discount must be non-negative"),
    expiryDate: Yup.date()
      .nullable()
      .notRequired()
      .min(new Date(), "Expiry date cannot be in the past"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const payload = {
        name: values.couponName.trim(),
        code: values.couponCode.trim().toUpperCase(),
        discountPercentage: Number(values.discount),
        maxDiscount: Number(values.maxAllowed),
        productId: values.productId,
        expiryDate: values.expiryDate || null,
        description: values.description || "",
        isActive: couponActive,
      };

      let res;
      if (id) {
        // Update coupon
        res = await axios.put(`${BASE_URL}/api/coupons/${id}`, payload);
      } else {
        // Add new coupon
        res = await axios.post(`${BASE_URL}/api/coupons`, payload);
      }

      if (res.data.success || res.status === 200) {
        toast.success(
          id ? "Coupon updated successfully!" : "Coupon added successfully!"
        );
        resetForm();
        setTimeout(() => navigate("/admin/coupon"), 1500);
      } else {
        toast.error(res.data.message || "Failed to save coupon.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle coupon active status (only in edit mode)
  const toggleStatus = async () => {
    try {
      const res = await axios.patch(
        `${BASE_URL}/api/coupons/${id}/toggle-status`
      );
      if (res.data.success) {
        setCouponActive((prev) => !prev);
        toast.success(`Coupon is now ${!couponActive ? "Active" : "Inactive"}`);
      } else {
        toast.error("Failed to toggle coupon status");
      }
    } catch (err) {
      toast.error("Error toggling status");
    }
  };

  // Delete modal controls
  const openDeleteModal = () => setShowDeleteModal(true);
  const closeDeleteModal = () => setShowDeleteModal(false);

  // Confirm delete
  const confirmDelete = async () => {
    try {
      const res = await axios.delete(`${BASE_URL}/api/coupons/${id}`);
      if (res.data.success) {
        toast.success("Coupon deleted successfully!");
        navigate("/admin/coupon");
      } else {
        toast.error("Failed to delete coupon.");
      }
    } catch (err) {
      toast.error("Error deleting coupon");
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (loadingProducts || loadingCoupon) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow-md mt-6">
        <p className="text-gray-700 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  return (
    <div className="font-montserrat w-full max-w-full mx-auto p-1">
      <ToastContainer />
      <h2 className="text-lg font-semibold mb-4 text-start dark:text-gray-200">
        {id ? "Update Coupon" : "Add New Coupon"}
      </h2>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Form Section */}
        <div className="w-full bg-white dark:bg-gray-800 shadow-md rounded-md p-6 border border-gray-200 dark:border-gray-700">
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                {/* Grid for form fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Coupon Name */}
                  <div>
                    <label
                      htmlFor="couponName"
                      className="block mb-1 font-semibold text-gray-700 dark:text-gray-300"
                    >
                      Coupon Name <span className="text-red-500">*</span>
                    </label>
                    <Field
                      id="couponName"
                      name="couponName"
                      type="text"
                      placeholder="Enter coupon name"
                      className="w-full p-2 border border-gray-300 rounded-md
                   text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage
                      name="couponName"
                      component="div"
                      className="text-red-600 mt-1 text-sm"
                    />
                  </div>

                  {/* Coupon Code */}
                  <div>
                    <label
                      htmlFor="couponCode"
                      className="block mb-1 font-semibold text-gray-700 dark:text-gray-300"
                    >
                      Coupon Code <span className="text-red-500">*</span>
                    </label>
                    <Field
                      id="couponCode"
                      name="couponCode"
                      type="text"
                      placeholder="Enter coupon code"
                      className="w-full p-2 border border-gray-300 rounded-md
                   text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage
                      name="couponCode"
                      component="div"
                      className="text-red-600 mt-1 text-sm"
                    />
                  </div>

                  {/* Select Product */}
                  <div>
                    <label
                      htmlFor="productId"
                      className="block mb-1 font-semibold text-gray-700 dark:text-gray-300"
                    >
                      Select Product <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="select"
                      id="productId"
                      name="productId"
                      className="w-full p-2 border border-gray-300 rounded-md
                   text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Select a product --</option>
                      {products.map((product) => (
                        <option key={product._id} value={product._id}>
                          {product.productId}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="productId"
                      component="div"
                      className="text-red-600 mt-1 text-sm"
                    />
                  </div>

                  {/* Discount Percentage */}
                  <div>
                    <label
                      htmlFor="discount"
                      className="block mb-1 font-semibold text-gray-700 dark:text-gray-300"
                    >
                      Discount Percentage (%){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <Field
                      id="discount"
                      name="discount"
                      type="number"
                      placeholder="Enter discount percentage"
                      min="1"
                      max="100"
                      className="w-full p-2 border border-gray-300 rounded-md
                   text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage
                      name="discount"
                      component="div"
                      className="text-red-600 mt-1 text-sm"
                    />
                  </div>

                  {/* Max Allowed Discount */}
                  <div>
                    <label
                      htmlFor="maxAllowed"
                      className="block mb-1 font-semibold text-gray-700 dark:text-gray-300"
                    >
                      Max Allowed Discount (₹){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <Field
                      id="maxAllowed"
                      name="maxAllowed"
                      type="number"
                      placeholder="Enter max discount amount"
                      min="0"
                      className="w-full p-2 border border-gray-300 rounded-md
                   text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage
                      name="maxAllowed"
                      component="div"
                      className="text-red-600 mt-1 text-sm"
                    />
                  </div>

                  {/* Expiry Date */}
                  <div>
                    <label
                      htmlFor="expiryDate"
                      className="block mb-1 font-semibold text-gray-700 dark:text-gray-300"
                    >
                      Expiry Date
                    </label>
                    <Field
                      id="expiryDate"
                      name="expiryDate"
                      type="date"
                      className="w-full p-2 border border-gray-300 rounded-md
                   text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage
                      name="expiryDate"
                      component="div"
                      className="text-red-600 mt-1 text-sm"
                    />
                  </div>
                </div>

                {/* Description - Full Width */}
                <div>
                  <label
                    htmlFor="description"
                    className="block mb-1 font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Description
                  </label>
                  <Field
                    as="textarea"
                    id="description"
                    name="description"
                    rows="3"
                    placeholder="Enter description (optional)"
                    className="w-full p-2 border border-gray-300 rounded-md
                 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700
                 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-2"
                  >
                    {id ? "Update Coupon" : "Add Coupon"}
                  </Button>

                  {id && (
                    <div className="flex flex-wrap items-center gap-4">
                      <Button
                        type="button"
                        onClick={toggleStatus}
                        className={`px-6 py-2 ${
                          couponActive ? "bg-green-600" : "bg-gray-600"
                        } hover:opacity-90 text-white rounded`}
                      >
                        {couponActive ? "Deactivate" : "Activate"}
                      </Button>

                      <Button
                        type="button"
                        onClick={openDeleteModal}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded"
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>

        {/* Coupon Details panel on right */}
        {id && (
          <div className="w-full lg:w-1/2">
            <CouponDetails couponId={id} />
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        visible={showDeleteModal}
        title="Confirm Delete Coupon"
        onCancel={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default AddCouponPage;
