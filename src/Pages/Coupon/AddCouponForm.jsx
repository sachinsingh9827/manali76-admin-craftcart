import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../../components/Reusable/Button";

const BASE_URL = "https://craft-cart-backend.vercel.app";

const AddCouponPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
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
          toast.error("Failed to load products");
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
        toast.error("Error loading data");
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
        name: values.couponName.trim(),
        code: values.couponCode.trim().toUpperCase(),
        discountPercentage: Number(values.discount),
        maxDiscount: Number(values.maxAllowed),
        product: values.productId,
        expiryDate: values.expiryDate,
        description: values.description,
      };

      const res = id
        ? await axios.put(`${BASE_URL}/api/coupons/${id}`, payload)
        : await axios.post(`${BASE_URL}/api/coupons`, payload);

      if (res.data.success) {
        toast.success(id ? "Coupon updated!" : "Coupon added!");
        setTimeout(() => {
          resetForm();
          navigate("/admin/coupon");
        }, 1500);
      } else {
        toast.error(res.data.message || "Failed to save coupon");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error submitting coupon form"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow-md mt-6">
        <p className="text-gray-700 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded shadow-md mt-6 font-montserrat">
      <ToastContainer />
      <h2 className="text-xl font-bold mb-6 dark:text-white">
        {id ? "Update Coupon" : "Add New Coupon"}
      </h2>

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

            {/* Discount */}
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
              />
              <ErrorMessage
                name="discount"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Max Allowed */}
            <div>
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                Max Allowed (₹)<span className="text-red-500">*</span>
              </label>
              <Field
                name="maxAllowed"
                type="number"
                min="0"
                className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-black dark:text-white"
              />
              <ErrorMessage
                name="maxAllowed"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Product Select */}
            <div>
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
                    {p.productId}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="productId"
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

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                Description (optional)
              </label>
              <Field
                as="textarea"
                name="description"
                rows="3"
                className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-black dark:text-white"
              />
            </div>

            {/* Submit */}
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? id
                    ? "Updating..."
                    : "Adding..."
                  : id
                  ? "Update Coupon"
                  : "Add Coupon"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddCouponPage;
