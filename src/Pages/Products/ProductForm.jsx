import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Button from "../../components/Reusable/Button";
import AdminProductDetails from "./AdminProductDetails";
import LoadingPage from "../../components/Navbar/LoadingPage";
import { showToast } from "../../components/Toast/Toast";

const BASE_URL = "https://craft-cart-backend.vercel.app";

const validationSchema = Yup.object({
  name: Yup.string().required("Required"),
  price: Yup.number().required("Required").positive("Must be positive"),
  description: Yup.string().required("Required"),
  category: Yup.string().required("Required"),
  brand: Yup.string(),
  stock: Yup.number().required("Required").min(0, "Must be >= 0"),
});

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

const ProductForm = () => {
  const [existingImages, setExistingImages] = useState([]);
  const [newImagesPreview, setNewImagesPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [productActive, setProductActive] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [initialValues, setInitialValues] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    brand: "",
    stock: "",
    createdBy: "", // This will be sent but not shown in the form
    images: [],
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const apiRequest = async ({ method, url, data }) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user._id) throw new Error("User  not logged in");

    try {
      const config = {
        method,
        url,
        data,
        headers:
          data instanceof FormData
            ? { "Content-Type": "multipart/form-data" }
            : {},
      };
      const res = await axios(config);
      if (!res.data.success) throw new Error(res.data.message || "API Error");
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    if (!id) {
      setInitialValues({
        name: "",
        price: "",
        description: "",
        category: "",
        brand: "",
        stock: "",
        createdBy: "", // Reset for new product
        images: [],
      });
      setExistingImages([]);
      setProductActive(true);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    axios
      .get(`${BASE_URL}/api/admin/protect/${id}`)
      .then((res) => {
        if (res.data.success) {
          const product = res.data.data;
          setInitialValues({
            name: product.name || "",
            price: product.price || "",
            description: product.description || "",
            category: product.category || "",
            brand: product.brand || "",
            stock: product.stock || "",
            createdBy: product.createdBy || "", // Set for existing product
            images: [],
          });
          setExistingImages(product.images || []);
          setProductActive(product.isAvailable ?? true);
        } else {
          setError("Failed to load product");
        }
      })
      .catch(() => setError("Error loading product"))
      .finally(() => setLoading(false));
  }, [id]);

  const clearNewImagePreviews = () => {
    newImagesPreview.forEach((url) => URL.revokeObjectURL(url));
    setNewImagesPreview([]);
  };

  const onImagesChange = (e, setFieldValue) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setFieldValue("images", files);
    clearNewImagePreviews();
    const previews = files.map((file) => URL.createObjectURL(file));
    setNewImagesPreview(previews);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user._id) {
      values.createdBy = user._id; // Set createdBy to the user's ID
    } else {
      showToast("User  not logged in", "info");
      setSubmitting(false);
      return;
    }

    const formData = new FormData();
    Object.entries(values).forEach(([key, val]) => {
      if (key !== "images") formData.append(key, val);
    });

    if (values.images && values.images.length > 0) {
      values.images.forEach((file) => formData.append("images", file));
    }

    try {
      const isUpdate = !!id; // Determine if we are updating
      const url = isUpdate
        ? `${BASE_URL}/api/admin/protect/${id}`
        : `${BASE_URL}/api/admin/protect`;
      const method = isUpdate ? "put" : "post";

      const res = await axios({
        method,
        url,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        showToast(isUpdate ? "Product updated!" : "Product added!", "success");
        clearNewImagePreviews();
        resetForm();
        navigate("/admin/products");
      } else {
        showToast("Error: " + res.data.message);
      }
    } catch (err) {
      showToast("Network error.");
      console.error(err);
    }
    setSubmitting(false);
  };

  const openDeleteModal = () => setShowDeleteModal(true);
  const closeDeleteModal = () => setShowDeleteModal(false);

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await apiRequest({
        method: "delete",
        url: `${BASE_URL}/api/admin/protect/${id}`,
      });
      showToast("Product deleted!", "success");
      navigate("/admin/products");
    } catch (err) {
      showToast("Delete failed: " + (err.message || "Network error."), "error");
      console.error(err);
    } finally {
      setLoading(false);
      closeDeleteModal();
    }
  };

  const toggleStatus = async () => {
    try {
      setLoading(true);
      await apiRequest({
        method: "put",
        url: `${BASE_URL}/api/admin/protect/${id}/status`,
        data: { active: !productActive },
      });
      setProductActive(!productActive);
      showToast(
        `Product is now ${!productActive ? "Active" : "Inactive"}`,
        "success"
      );
    } catch (err) {
      showToast(
        "Status change failed: " + (err.message || "Network error.", "error")
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="text-center py-10">
        <LoadingPage />
      </div>
    );
  if (error)
    return <div className="text-red-600 text-center py-2">{error}</div>;

  return (
    <div className="font-montserrat w-full mx-auto p-1">
      <h2 className="text-lg font-semibold mb-6 text-start dark:text-gray-200">
        {id ? "Update Product" : "Add New Product"}
      </h2>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* FORM */}
        <div className="w-full bg-white dark:bg-gray-800 shadow-md rounded-md p-2 border border-gray-200 dark:border-gray-700">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, setFieldValue, values }) => (
              <Form className="space-y-6">
                {/* Images Preview */}
                {(existingImages.length > 0 || newImagesPreview.length > 0) && (
                  <div className="flex flex-wrap gap-4 mb-6">
                    {existingImages.map((imgObj, idx) => (
                      <img
                        key={"existing-" + idx}
                        src={imgObj.url}
                        alt={`Existing Product ${idx}`}
                        className="w-24 h-24 object-cover rounded-md border border-gray-300 dark:border-gray-600"
                      />
                    ))}

                    {newImagesPreview.map((src, idx) => (
                      <img
                        key={"new-" + idx}
                        src={src}
                        alt={`New Upload ${idx}`}
                        className="w-24 h-24 object-cover rounded-md border border-blue-400"
                      />
                    ))}
                  </div>
                )}

                {/* Upload images input */}
                <div>
                  <label
                    htmlFor="images"
                    className="block font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Upload Images (Max 5)
                  </label>
                  <input
                    id="images"
                    name="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => onImagesChange(e, setFieldValue)}
                    className="w-full border border-gray-300 rounded-md p-2
                   text-gray-900 dark:text-gray-100
                   bg-white dark:bg-gray-700
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="images"
                    component="div"
                    className="text-red-600 mt-1 text-sm"
                  />
                </div>

                {/* Name & Brand in one row */}
                <div className="flex gap-6">
                  {/* Name */}
                  <div className="flex-1">
                    <label
                      htmlFor="name"
                      className="block mb-1 font-semibold text-gray-700 dark:text-gray-300"
                    >
                      Name
                    </label>
                    <Field
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Product Name"
                      className="w-full p-1 border border-gray-300 rounded-md
                     text-gray-900 dark:text-gray-100
                     bg-white dark:bg-gray-700
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-600 mt-1 text-sm"
                    />
                  </div>

                  {/* Brand */}
                  <div className="flex-1">
                    <label
                      htmlFor="brand"
                      className="block mb-1 font-semibold text-gray-700 dark:text-gray-300"
                    >
                      Brand (optional)
                    </label>
                    <Field
                      id="brand"
                      name="brand"
                      type="text"
                      placeholder="Brand"
                      className="w-full p-1 border border-gray-300 rounded-md
                     text-gray-900 dark:text-gray-100
                     bg-white dark:bg-gray-700
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage
                      name="brand"
                      component="div"
                      className="text-red-600 mt-1 text-sm"
                    />
                  </div>
                </div>

                {/* Price & Stock in one row */}
                <div className="flex gap-6">
                  {/* Price */}
                  <div className="flex-1">
                    <label
                      htmlFor="price"
                      className="block mb-1 font-semibold text-gray-700 dark:text-gray-300"
                    >
                      Price
                    </label>
                    <Field
                      id="price"
                      name="price"
                      type="number"
                      placeholder="Price"
                      className="w-full p-1 border border-gray-300 rounded-md
                     text-gray-900 dark:text-gray-100
                     bg-white dark:bg-gray-700
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage
                      name="price"
                      component="div"
                      className="text-red-600 mt-1 text-sm"
                    />
                  </div>

                  {/* Stock */}
                  <div className="flex-1">
                    <label
                      htmlFor="stock"
                      className="block mb-1 font-semibold text-gray-700 dark:text-gray-300"
                    >
                      Stock
                    </label>
                    <Field
                      id="stock"
                      name="stock"
                      type="number"
                      placeholder="Stock"
                      className="w-full p-1 border border-gray-300 rounded-md
                     text-gray-900 dark:text-gray-100
                     bg-white dark:bg-gray-700
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage
                      name="stock"
                      component="div"
                      className="text-red-600 mt-1 text-sm"
                    />
                  </div>
                </div>

                {/* Description (full width) */}
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
                    placeholder="Product description"
                    rows="3"
                    className="w-full p-1 border border-gray-300 rounded-md
                   text-gray-900 dark:text-gray-100
                   bg-white dark:bg-gray-700
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-600 mt-1 text-sm"
                  />
                </div>

                {/* Category */}
                <div>
                  <label
                    htmlFor="category"
                    className="block mb-1 font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Category
                  </label>
                  <Field
                    id="category"
                    name="category"
                    type="text"
                    placeholder="Category"
                    className="w-full p-1 border border-gray-300 rounded-md
                   text-gray-900 dark:text-gray-100
                   bg-white dark:bg-gray-700
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="category"
                    component="div"
                    className="text-red-600 mt-1 text-sm"
                  />
                </div>

                {/* Created By - Only show if updating an existing product */}
                {id && (
                  <div>
                    <label
                      htmlFor="createdBy"
                      className="block mb-1 font-semibold text-gray-700 dark:text-gray-300"
                    >
                      Created By
                    </label>
                    <Field name="createdBy">
                      {({ form }) => {
                        const name = form.values.createdBy?.name || "";

                        return (
                          <div className="relative w-full">
                            <input
                              id="createdBy"
                              type="text"
                              placeholder="Created By"
                              className="w-full p-1 border border-gray-300 rounded-md
            text-gray-900 dark:text-gray-100
            bg-white dark:bg-gray-700
            focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={name}
                              readOnly
                              onMouseEnter={() => setShowTooltip(true)}
                              onMouseLeave={() => setShowTooltip(false)}
                              onClick={() => setShowTooltip(true)}
                            />

                            {showTooltip && (
                              <div className="absolute top-full mt-1 left-0 bg-yellow-100 text-yellow-800 px-2 py-1 text-xs rounded shadow-md z-10">
                                ⚠️ This field is not editable.
                              </div>
                            )}
                          </div>
                        );
                      }}
                    </Field>

                    <ErrorMessage
                      name="createdBy"
                      component="div"
                      className="text-red-600 mt-1 text-sm"
                    />
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex items-center gap-4">
                  <Button type="submit" disabled={isSubmitting}>
                    {id ? "Update" : "Add Product"}
                  </Button>

                  {/* Active toggle button, only for update */}
                  {id && (
                    <Button
                      onClick={toggleStatus}
                      className={`px-6 py-2 ${
                        productActive
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                      type="button"
                    >
                      {productActive ? "Active" : "Inactive"}
                    </Button>
                  )}

                  {/* Delete Button, only for update */}
                  {id && (
                    <Button onClick={openDeleteModal} type="button">
                      Delete
                    </Button>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>

        {/* PRODUCT DETAILS */}
        {id && (
          <div className="w-full max-w-md">
            <AdminProductDetails
              productId={id}
              existingImages={existingImages}
              setExistingImages={setExistingImages}
            />
          </div>
        )}
      </div>

      <DeleteConfirmModal
        visible={showDeleteModal}
        title="Confirm Delete"
        onCancel={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default ProductForm;
