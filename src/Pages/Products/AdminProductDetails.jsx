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
    // 👇 Scroll to top on page load
    window.scrollTo(0, 0);
    fetchProduct();
  }, [id]);

  if (loading) return <LoadingPage />;
  if (!product)
    return (
      <p>
        <NoDataFound />
      </p>
    );

  return (
    <div className="max-w-full mx-auto p-2 dark:bg-gray-800 relative">
      <h2 className="text-xl font-bold mb-4 text-center">Product Details</h2>

      {/* Images */}
      {/* Images */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {product.images.map((imgObj, i) => (
          <img
            key={i}
            src={imgObj.url} // Direct URL from backend
            alt={`Product ${i}`}
            onClick={() => setSelectedImage(imgObj.url)}
            className="w-20 h-20 object-cover border border-gray-300 rounded-md cursor-pointer hover:scale-105 transition"
          />
        ))}
      </div>

      {/* Product Info */}
      <div className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
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
      </div>

      {/* Toggle Availability */}
      <div className="mt-6 flex items-center justify-between">
        <span className="font-medium">
          Status:{" "}
          <span
            className={product.isAvailable ? "text-green-600" : "text-red-600"}
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

      {/* Modal Image Preview */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-full max-h-full p-4">
            <img
              src={selectedImage}
              alt="Full Size"
              className="max-w-full max-h-screen rounded shadow-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 text-white text-xl font-bold bg-black bg-opacity-50 px-2 py-1 rounded"
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
