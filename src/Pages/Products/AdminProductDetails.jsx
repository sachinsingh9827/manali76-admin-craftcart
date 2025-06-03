import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Button from "../../components/Reusable/Button";
import LoadingPage from "../../components/Navbar/LoadingPage";
import NoDataFound from "../../components/Reusable/NoDataFound";

const BASE_URL = "https://craft-cart-backend.vercel.app";

const AdminProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/protect/${id}`);
      setProduct(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error("❌ Failed to fetch product:", err);
      setLoading(false);
    }
  };

  const toggleAvailability = async () => {
    if (!product) return;
    const updatedStatus = !product.isAvailable;
    setUpdating(true);
    try {
      await axios.put(`${BASE_URL}/api/admin/protect/${id}`, {
        isAvailable: updatedStatus,
      });
      setProduct((prev) => ({ ...prev, isAvailable: updatedStatus }));
    } catch (err) {
      console.error("❌ Failed to update status:", err);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProduct();
  }, [id]);

  if (loading) return <LoadingPage />;
  if (!product) return <NoDataFound />;

  return (
    <div className="max-w-4xl mx-auto p-4 dark:bg-gray-900 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        Product Details
      </h2>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Main Image */}
        <div className="w-full md:w-1/2">
          <img
            src={selectedImage || product.images[0]?.url}
            alt="Main"
            className="rounded-lg border object-cover w-full h-64 md:h-80"
          />
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2 space-y-3 text-sm text-gray-700 dark:text-gray-200">
          <p>
            <strong>Product ID:</strong> {product.productId}
          </p>
          <p>
            <strong>Name:</strong> {product.name}
          </p>
          <p>
            <strong>Price:</strong> ₹{product.price}
          </p>
          <p>
            <strong>Description:</strong> {product.description}
          </p>
          <p>
            <strong>Category:</strong> {product.category}
          </p>
          <p>
            <strong>Brand:</strong> {product.brand}
          </p>
          <p>
            <strong>Stock:</strong> {product.stock}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(product.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Created By:</strong> {product.createdBy?.name}
          </p>

          {/* Availability Toggle */}
          <div className="flex items-center justify-between mt-4">
            <span className="font-medium">
              Status:{" "}
              <span
                className={
                  product.isAvailable ? "text-green-600" : "text-red-600"
                }
              >
                {product.isAvailable ? "Available" : "Not Available"}
              </span>
            </span>

            <Button onClick={toggleAvailability} disabled={updating}>
              {updating
                ? "Updating..."
                : product.isAvailable
                ? "Mark as Not Available"
                : "Mark as Available"}
            </Button>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="mt-6">
        <h3 className="text-md font-semibold mb-2 text-gray-700 dark:text-gray-300">
          Image Gallery
        </h3>
        <div className="flex gap-3 flex-wrap">
          {product.images.map((img, i) => (
            <img
              key={i}
              src={img.url}
              alt={`Product ${i}`}
              onClick={() => setSelectedImage(img.url)}
              className="w-20 h-20 object-cover border rounded cursor-pointer hover:scale-105 transition"
            />
          ))}
        </div>
      </div>

      {/* Modal Preview */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative p-4 max-w-full max-h-full">
            <img
              src={selectedImage}
              alt="Preview"
              className="max-w-full max-h-screen rounded shadow-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 text-white text-xl font-bold bg-black bg-opacity-60 px-3 py-1 rounded"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductDetails;
