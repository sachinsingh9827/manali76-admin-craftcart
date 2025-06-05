import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../../components/Reusable/Button";
import CouponDetails from "./CouponDetails";
import LoadingPage from "../../components/Navbar/LoadingPage";
import ConfirmationModal from "../../components/Reusable/ConfirmationModal";
import { showToast } from "../../components/Toast/Toast";

const BASE_URL = "https://craft-cart-backend.vercel.app";

// Component to auto update maxAllowed when product or discount changes
const AutoMaxAllowed = ({ products }) => {
  const { values, setFieldValue } = useFormikContext();

  useEffect(() => {
    if (values.productId && values.discount) {
      const selectedProduct = products.find((p) => p._id === values.productId);
      if (selectedProduct) {
        const price = selectedProduct.price || 0;
        const maxDiscount = (price * values.discount) / 100;
        setFieldValue("maxAllowed", maxDiscount.toFixed(2));
      } else {
        setFieldValue("maxAllowed", "");
      }
    }
  }, [values.productId, values.discount, products, setFieldValue]);

  return null; // This component does not render anything
};

const AddCouponPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [initialValues, setInitialValues] = useState({
    couponName: "",
    couponCode: "",
    discount: "",
    maxAllowed: "",
    productId: "",
    expiryDate: "",
    description: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, couponRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/admin/protect/active-summaries`),
          id ? axios.get(`${BASE_URL}/api/coupons/${id}`) : Promise.resolve({}),
        ]);

        if (productRes.data.success) {
          setProducts(productRes.data.data);
        } else {
          showToast("Failed to load products", "error");
        }

        if (id && couponRes?.data?.success) {
          const c = couponRes.data.data;
          setInitialValues({
            couponName: c.name || "",
            couponCode: c.code || "",
            discount: c.discountPercentage || "",
            maxAllowed: c.maxDiscount || "",
            productId: c.product?._id || "",
            expiryDate: c.expiryDate ? c.expiryDate.split("T")[0] : "",
            description: c.description || "",
          });
        }
      } catch (error) {
        showToast("Error loading data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const validationSchema = Yup.object().shape({
    couponName: Yup.string().required("Coupon name is required"),
    couponCode: Yup.string().required("Coupon code is required"),
    discount: Yup.number()
      .required("Discount is required")
      .min(1, "Must be at least 1%")
      .max(100, "Cannot exceed 100%"),
    maxAllowed: Yup.number()
      .required("Max allowed is required")
      .min(0, "Must be non-negative"),
    productId: Yup.string().required("Select a product"),
    expiryDate: Yup.date()
      .nullable()
      .required("Expiry date is required")
      .min(
        new Date().toISOString().split("T")[0],
        "Expiry date cannot be in the past"
      ),
    description: Yup.string(),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const payload = {
        couponName: values.couponName.trim(),
        couponCode: values.couponCode.trim().toUpperCase(),
        discount: Number(values.discount),
        maxAllowed: Number(values.maxAllowed),
        productId: values.productId,
        expiryDate: values.expiryDate,
        description: values.description || "",
      };

      const res = id
        ? await axios.put(`${BASE_URL}/api/coupons/${id}`, payload)
        : await axios.post(`${BASE_URL}/api/coupons`, payload);

      if (res.data.success) {
        showToast(id ? "Coupon updated!" : "Coupon added!", "success");
        setTimeout(() => {
          resetForm();
          navigate("/admin/coupon");
        }, 1500);
      } else {
        showToast(res.data.message || "Failed to save coupon", "error");
      }
    } catch (error) {
      showToast.error(
        error.response?.data?.message || "Error submitting coupon form"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCoupon = async () => {
    try {
      const res = await axios.delete(`${BASE_URL}/api/coupons/${id}`);
      if (res.data.success) {
        showToast("Coupon deleted successfully!", "success");
        setShowConfirmModal(false);
        setTimeout(() => {
          navigate("/admin/coupon");
        }, 1500);
      } else {
        showToast.error("Failed to delete coupon", "error");
      }
    } catch (error) {
      showToast("Error deleting coupon", "error");
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow-md mt-6">
        <LoadingPage />
      </div>
    );
  }

  return (
    <div className="font-montserrat w-full max-w-full mx-auto p-1">
      <ToastContainer />
      <h2 className="text-sm uppercase font-semibold mb-4 text-start dark:text-gray-200">
        {id ? "Update Coupon" : "Add New Coupon"}
      </h2>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Form Section */}
        <div className="w-full lg:w-1/2">
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <Formik
              initialValues={initialValues}
              enableReinitialize
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Coupon Name */}
                  <div>
                    <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                      Coupon Name<span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="couponName"
                      type="text"
                      className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-black dark:text-white"
                    />
                    <ErrorMessage
                      name="couponName"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Coupon Code */}
                  <div>
                    <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                      Coupon Code<span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="couponCode"
                      type="text"
                      className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-black dark:text-white"
                    />
                    <ErrorMessage
                      name="couponCode"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Select Product */}
                  <div className="md:col-span-2">
                    <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                      Select Product<span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="select"
                      name="productId"
                      className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-black dark:text-white"
                    >
                      <option value="">-- Select Product --</option>
                      {products.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name} - ₹{p.price} ({p.productId})
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="productId"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Discount % */}
                  <div>
                    <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                      Discount (%)<span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="discount"
                      type="number"
                      min="1"
                      max="100"
                      className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-black dark:text-white"
                      step="0.01"
                    />
                    <ErrorMessage
                      name="discount"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Max Allowed (Auto-filled) */}
                  <div>
                    <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                      Max Allowed (₹)<span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="maxAllowed"
                      type="number"
                      className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-black dark:text-white"
                      disabled
                    />
                    <ErrorMessage
                      name="maxAllowed"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Expiry Date */}
                  <div>
                    <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                      Expiry Date<span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="expiryDate"
                      type="date"
                      className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-black dark:text-white"
                    />
                    <ErrorMessage
                      name="expiryDate"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="md:col-span-2 flex justify-between items-center">
                    {id && (
                      <Button
                        type="button"
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => setShowConfirmModal(true)}
                      >
                        Delete
                      </Button>
                    )}
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting
                        ? id
                          ? "Updating..."
                          : "Adding..."
                        : id
                        ? "Update "
                        : "Add "}
                    </Button>
                  </div>

                  {/* This component watches changes and auto sets maxAllowed */}
                  <AutoMaxAllowed products={products} />
                </Form>
              )}
            </Formik>
          </div>
        </div>

        {id && (
          <div className="w-full lg:w-1/2">
            <CouponDetails couponId={id} />
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        title="Confirm Delete"
        message="Are you sure you want to delete this coupon?"
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={handleDeleteCoupon}
      />
    </div>
  );
};

export default AddCouponPage;
