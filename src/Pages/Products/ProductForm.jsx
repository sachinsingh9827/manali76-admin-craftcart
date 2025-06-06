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

  // Store creator info as object with _id and name
  const [creator, setCreator] = useState({ _id: "", name: "" });

  const [initialValues, setInitialValues] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    brand: "",
    stock: "",
    images: [],
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const apiRequest = async ({ method, url, data }) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user._id) throw new Error("User not logged in");

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
      // New product, clear creator and form
      setInitialValues({
        name: "",
        price: "",
        description: "",
        category: "",
        brand: "",
        stock: "",
        images: [],
      });
      setCreator({ _id: "", name: "" });
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
            images: [],
          });
          setExistingImages(product.images || []);
          setProductActive(product.isAvailable ?? true);

          // Set creator from fetched product's createdBy object
          setCreator({
            _id: product.createdBy?._id || "",
            name: product.createdBy?.name || "",
          });
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
    if (!user || !user._id) {
      showToast("User not logged in", "info");
      setSubmitting(false);
      return;
    }

    // Use existing creator _id if updating; else current user's id if new product
    const creatorId = id ? creator._id : user._id;

    const formData = new FormData();

    Object.entries(values).forEach(([key, val]) => {
      if (key !== "images") {
        formData.append(key, val);
      }
    });

    formData.append("createdBy", creatorId);

    if (values.images && values.images.length > 0) {
      values.images.forEach((file) => formData.append("images", file));
    }

    try {
      const isUpdate = !!id;
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
        data: { isActive: !productActive },
      });
      setProductActive(!productActive);
      showToast(
        `Product is now ${!productActive ? "Active" : "Inactive"}`,
        "success"
      );
    } catch (err) {
      showToast(
        "Status change failed: " + (err.message || "Network error."),
        "error"
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
      <h2 className="text-sm uppercase font-semibold mb-6 text-start dark:text-gray-200">
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
                {/* Image previews */}
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

                {/* Upload */}
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
                    className="w-full border border-gray-300 rounded-md p-1 mt-1 text-sm dark:bg-gray-700 dark:text-gray-100"
                  />
                  <ErrorMessage
                    name="images"
                    component="div"
                    className="text-red-600 text-sm"
                  />
                </div>

                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Name
                  </label>
                  <Field
                    id="name"
                    name="name"
                    placeholder="Product Name"
                    className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-100"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-600 text-sm"
                  />
                </div>

                {/* Price + Stock */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full">
                    <label
                      htmlFor="price"
                      className="block font-semibold text-gray-700 dark:text-gray-300"
                    >
                      Price
                    </label>
                    <Field
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      placeholder="Price"
                      className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-100"
                    />
                    <ErrorMessage
                      name="price"
                      component="div"
                      className="text-red-600 text-sm"
                    />
                  </div>

                  <div className="w-full">
                    <label
                      htmlFor="stock"
                      className="block font-semibold text-gray-700 dark:text-gray-300"
                    >
                      Stock
                    </label>
                    <Field
                      id="stock"
                      name="stock"
                      type="number"
                      placeholder="Stock"
                      className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-100"
                    />
                    <ErrorMessage
                      name="stock"
                      component="div"
                      className="text-red-600 text-sm"
                    />
                  </div>
                </div>

                {/* Category + Brand */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full">
                    <label
                      htmlFor="category"
                      className="block font-semibold text-gray-700 dark:text-gray-300"
                    >
                      Category
                    </label>
                    <Field
                      id="category"
                      name="category"
                      placeholder="Category"
                      className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-100"
                    />
                    <ErrorMessage
                      name="category"
                      component="div"
                      className="text-red-600 text-sm"
                    />
                  </div>

                  <div className="w-full">
                    <label
                      htmlFor="brand"
                      className="block font-semibold text-gray-700 dark:text-gray-300"
                    >
                      Brand
                    </label>
                    <Field
                      id="brand"
                      name="brand"
                      placeholder="Brand"
                      className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-100"
                    />
                    <ErrorMessage
                      name="brand"
                      component="div"
                      className="text-red-600 text-sm"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Description
                  </label>
                  <Field
                    as="textarea"
                    id="description"
                    name="description"
                    rows="3"
                    placeholder="Product Description"
                    className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-100"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-600 text-sm"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold"
                >
                  {id ? "Update Product" : "Add Product"}
                </Button>
              </Form>
            )}
          </Formik>
        </div>

        {/* DETAILS & ACTIONS */}
        {id && (
          <div className="w-full lg:w-1/3 space-y-6">
            <AdminProductDetails
              productId={id}
              createdByName={creator.name}
              isActive={productActive}
              toggleStatus={toggleStatus}
              openDeleteModal={openDeleteModal}
            />
          </div>
        )}
      </div>

      <DeleteConfirmModal
        visible={showDeleteModal}
        title="Delete Product"
        onCancel={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default ProductForm;
