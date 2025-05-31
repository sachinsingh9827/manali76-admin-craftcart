import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Button from "../../components/Reusable/Button";
import AdminProductDetails from "./AdminProductDetails";

const validationSchema = Yup.object({
  name: Yup.string().required("Required"),
  price: Yup.number().required("Required").positive("Must be positive"),
  description: Yup.string().required("Required"),
  category: Yup.string().required("Required"),
  brand: Yup.string(),
  stock: Yup.number().required("Required").min(0, "Must be >= 0"),
});

const ProductForm = () => {
  const [existingImages, setExistingImages] = useState([]);
  const [newImagesPreview, setNewImagesPreview] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const formikRef = useRef(null);

  const initialValues = {
    name: "",
    price: "",
    description: "",
    category: "",
    brand: "",
    stock: "",
    createdBy: "",
    images: [],
  };

  useEffect(() => {
    if (!id) {
      setIsUpdate(false);
      setExistingImages([]);
      return;
    }

    setLoading(true);
    axios
      .get(`http://localhost:5000/api/admin/protect/${id}`)
      .then((res) => {
        if (res.data.success) {
          const product = res.data.data;
          setIsUpdate(true);
          setExistingImages(product.images || []);
          if (formikRef.current) {
            formikRef.current.setValues({
              name: product.name || "",
              price: product.price || "",
              description: product.description || "",
              category: product.category || "",
              brand: product.brand || "",
              stock: product.stock || "",
              createdBy: "",
              images: [],
            });
          }
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

  const onImagesChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    if (formikRef.current) {
      formikRef.current.setFieldValue("images", files);
    }
    clearNewImagePreviews();
    const previews = files.map((file) => URL.createObjectURL(file));
    setNewImagesPreview(previews);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user._id) {
      values.createdBy = user._id;
    } else {
      alert("User not logged in");
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
      const url = isUpdate
        ? `http://localhost:5000/api/admin/protect/${id}`
        : `http://localhost:5000/api/admin/protect`;
      const method = isUpdate ? "put" : "post";

      const res = await axios({
        method,
        url,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        alert(isUpdate ? "Product updated!" : "Product added!");
        clearNewImagePreviews();
        resetForm();
        navigate("/admin/products");
      } else {
        alert("Error: " + res.data.message);
      }
    } catch (err) {
      alert("Network error.");
      console.error(err);
    }
    setSubmitting(false);
  };

  if (loading)
    return <div className="text-center py-10">Loading product...</div>;
  if (error)
    return <div className="text-red-600 text-center py-4">{error}</div>;

  return (
    <div className="font-montserrat w-full px-2 sm:px-6 py-4">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        {isUpdate ? "Update Product" : "Add Product"}
      </h2>

      {/* Flex container for form + details */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* FORM */}
        <div className="w-full lg:w-2/3 bg-white dark:bg-gray-900 shadow-md rounded-md p-5">
          <Formik
            innerRef={formikRef}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting }) => (
              <Form className="space-y-5">
                {(existingImages.length > 0 || newImagesPreview.length > 0) && (
                  <div className="flex flex-wrap gap-3 mb-5">
                    {existingImages.map((img, idx) => (
                      <img
                        key={"existing-" + idx}
                        src={`http://localhost:5000/uploads/${img}`}
                        alt={`Existing Product ${idx}`}
                        className="w-20 h-20 object-cover rounded-md border border-gray-300 dark:border-gray-600"
                      />
                    ))}
                    {newImagesPreview.map((src, idx) => (
                      <img
                        key={"new-" + idx}
                        src={src}
                        alt={`New Upload ${idx}`}
                        className="w-20 h-20 object-cover rounded-md border border-blue-400"
                      />
                    ))}
                  </div>
                )}

                {/* Name & Price */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Field
                      type="text"
                      name="name"
                      placeholder="Name"
                      className="w-full p-3 border rounded text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-600 mt-1 text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <Field
                      type="number"
                      name="price"
                      placeholder="Price"
                      className="w-full p-3 border rounded text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                    />
                    <ErrorMessage
                      name="price"
                      component="div"
                      className="text-red-600 mt-1 text-sm"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Field
                    type="text"
                    name="description"
                    placeholder="Description"
                    className="w-full p-3 border rounded text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-600 mt-1 text-sm"
                  />
                </div>

                {/* Category & Brand */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Field
                      type="text"
                      name="category"
                      placeholder="Category"
                      className="w-full p-3 border rounded text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                    />
                    <ErrorMessage
                      name="category"
                      component="div"
                      className="text-red-600 mt-1 text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <Field
                      type="text"
                      name="brand"
                      placeholder="Brand"
                      className="w-full p-3 border rounded text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                    />
                    <ErrorMessage
                      name="brand"
                      component="div"
                      className="text-red-600 mt-1 text-sm"
                    />
                  </div>
                </div>

                {/* Stock */}
                <div>
                  <Field
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    className="w-full p-3 border rounded text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  />
                  <ErrorMessage
                    name="stock"
                    component="div"
                    className="text-red-600 mt-1 text-sm"
                  />
                </div>

                {/* Upload */}
                <div>
                  <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
                    Upload Images (Max 5)
                  </label>
                  <input
                    type="file"
                    name="images"
                    multiple
                    accept="image/*"
                    onChange={onImagesChange}
                    className="block w-full text-sm text-gray-900 dark:text-gray-300
                    file:mr-4 file:py-2 file:px-4
                    file:rounded file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                  />
                  <ErrorMessage
                    name="images"
                    component="div"
                    className="text-red-600 mt-1 text-sm"
                  />
                </div>

                {/* Submit Button */}
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? "Submitting..."
                    : isUpdate
                    ? "Update Product"
                    : "Add Product"}
                </Button>
              </Form>
            )}
          </Formik>
        </div>

        {/* ADMIN PRODUCT DETAILS */}
        {isUpdate && (
          <div className="w-full lg:w-1/3 bg-white dark:bg-gray-900 shadow-md rounded-md p-5">
            <AdminProductDetails />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductForm;
