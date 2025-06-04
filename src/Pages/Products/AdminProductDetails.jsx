import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Button from "../../components/Reusable/Button";
import LoadingPage from "../../components/Navbar/LoadingPage";
import NoDataFound from "../../components/Reusable/NoDataFound";
import { showToast } from "../../components/Toast/Toast";
import ConfirmationModal from "../../components/Reusable/ConfirmationModal"; // Your modal component
import { FaTrash, FaEdit } from "react-icons/fa";

const BASE_URL = "https://craft-cart-backend.vercel.app";

const AdminProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // For Delete/Update Image
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateImageModal, setShowUpdateImageModal] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);
  const navigate = useNavigate();
  // Fetch product details
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

  // Toggle availability status
  const toggleAvailability = async () => {
    if (!product) return;
    const updatedStatus = !product.isAvailable;
    setUpdating(true);
    try {
      await axios.put(`${BASE_URL}/api/admin/protect/${id}`, {
        isAvailable: updatedStatus,
      });
      setProduct((prev) => ({ ...prev, isAvailable: updatedStatus }));
      showToast(
        `Product is now ${updatedStatus ? "Available" : "Not Available"}`,
        "success"
      );
    } catch (err) {
      console.error("❌ Failed to update status:", err);
      showToast(
        "Status change failed: " + (err.message || "Network error."),
        "error"
      );
    } finally {
      setUpdating(false);
    }
  };

  // Delete image
  const handleDeleteImage = async () => {
    try {
      await axios.delete(
        `${BASE_URL}/api/admin/protect/${id}/image/${selectedImageId}`
      );
      showToast("Image deleted successfully", "success");
      fetchProduct();
    } catch (err) {
      console.error("Delete failed", err);
      showToast("Image deletion failed", "error");
    } finally {
      setShowDeleteModal(false);
      setSelectedImageId(null);
    }
  };

  // Update (replace) image
  const handleUpdateImage = async () => {
    if (!newImageFile) {
      showToast("No file selected", "error");
      return;
    }

    const formData = new FormData();
    formData.append("image", newImageFile); // Must match multer.single('image')

    try {
      await axios.put(
        `${BASE_URL}/api/admin/protect/${id}/image/${selectedImageId}`, // Ensure URL uses 'image' not 'images'
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Axios sets this automatically but being explicit is fine
          },
        }
      );

      showToast("Image updated successfully", "success");
      fetchProduct(); // Refresh product data after update
      navigate("/admin/products");
    } catch (err) {
      console.error("Update failed", err);
      showToast("Image update failed", "error");
    } finally {
      setShowUpdateImageModal(false);
      setNewImageFile(null);
      setSelectedImageId(null);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProduct();
  }, [id]);

  if (loading) return <LoadingPage />;
  if (!product) return <NoDataFound />;

  return (
    <div className="max-w-full mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md p-4">
      {/* Main info */}
      <div className="w-full flex flex-col md:flex-row bg-white dark:bg-gray-800 shadow-md rounded-md p-4 gap-4 border border-gray-200 dark:border-gray-700">
        {/* Main Image */}
        <div className="w-full md:w-1/2 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
          <img
            src={selectedImage || product.images[0]?.url}
            alt="Main"
            className="w-full h-64 md:h-80 object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2 text-gray-700 dark:text-gray-200 text-sm space-y-2">
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
        <div className="flex flex-wrap gap-3">
          {product.images.map((img, i) => (
            <div key={img._id || i} className="relative group">
              <img
                src={img.url}
                alt={`Product ${i}`}
                onClick={() => setSelectedImage(img.url)}
                className="w-20 h-20 object-cover border rounded cursor-pointer hover:scale-105 transition-transform"
              />

              {/* Hover buttons */}
              <div className="absolute inset-0 bg-black bg-opacity-30 hidden group-hover:flex items-center justify-center gap-2 rounded">
                <button
                  onClick={() => {
                    setSelectedImageId(img._id);
                    setShowDeleteModal(true);
                  }}
                  className="text-white hover:text-red-500"
                  title="Delete Image"
                >
                  <FaTrash />
                </button>
                <button
                  onClick={() => {
                    setSelectedImageId(img._id);
                    setShowUpdateImageModal(true);
                  }}
                  className="text-white hover:text-yellow-400"
                  title="Update Image"
                >
                  <FaEdit />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Preview */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Preview"
              className="max-w-full max-h-screen rounded shadow-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 text-white text-xl font-bold bg-black bg-opacity-60 px-3 py-1 rounded"
              aria-label="Close image preview"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Image"
        message="Are you sure you want to delete this image?"
        onConfirm={handleDeleteImage}
        onCancel={() => {
          setShowDeleteModal(false);
          setSelectedImageId(null);
        }}
      />

      {/* Update Image Modal */}
      <ConfirmationModal
        isOpen={showUpdateImageModal}
        title="Update Image"
        message={
          <>
            <p>Select a new image to replace the existing one.</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewImageFile(e.target.files[0])}
              className="mt-2"
            />
          </>
        }
        onConfirm={handleUpdateImage}
        onCancel={() => {
          setShowUpdateImageModal(false);
          setNewImageFile(null);
          setSelectedImageId(null);
        }}
      />
    </div>
  );
};

export default AdminProductDetails;
