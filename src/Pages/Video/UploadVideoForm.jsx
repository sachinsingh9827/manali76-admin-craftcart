import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../../components/Reusable/Button";
import LoadingPage from "../../components/Navbar/LoadingPage";
import { showToast } from "../../components/Toast/Toast";
import ConfirmationModal from "../../components/Reusable/ConfirmationModal";

const BASE_URL = "https://craft-cart-backend.vercel.app";

const UploadVideoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    platform: "YouTube",
    url: "",
    productId: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");

  const [showModal, setShowModal] = useState(false);

  // Fetch active products
  useEffect(() => {
    const fetchProducts = async () => {
      setProductsLoading(true);
      try {
        const res = await axios.get(
          `${BASE_URL}/api/admin/protect/active-summaries`
        );
        if (res.data.success) {
          setProducts(res.data.data || []);
        } else {
          setProductsError("Failed to load products");
        }
      } catch (err) {
        setProductsError("Error fetching products");
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch video if editing
  useEffect(() => {
    if (!id) return;

    setLoading(true);
    axios
      .get(`${BASE_URL}/api/videos/${id}`)
      .then((res) => {
        if (res.data.success) {
          setFormData({
            title: res.data.data.title || "",
            platform: res.data.data.platform || "YouTube",
            url: res.data.data.url || "",
            productId: res.data.data.productId?._id || "",
          });
        } else {
          setError("Video not found");
        }
      })
      .catch(() => setError("Failed to fetch video data"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (id) {
        const res = await axios.put(`${BASE_URL}/api/videos/${id}`, formData);
        if (res.data.success) {
          showToast("Video updated successfully", "success");
          navigate("/admin/videos");
        } else {
          showToast(res.data.message || "Failed to update video");
          setError(res.data.message || "Failed to update video");
        }
      } else {
        const res = await axios.post(`${BASE_URL}/api/videos`, formData);
        if (res.data.success) {
          showToast("Video added successfully", "success");
          navigate("/admin/videos");
        } else {
          showToast(res.data.message || "Failed to add video");
          setError(res.data.message || "Failed to add video");
        }
      }
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "An error occurred";
      showToast(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setShowModal(false);
    setLoading(true);
    try {
      const res = await axios.delete(`${BASE_URL}/api/videos/${id}`);
      if (res.data.success) {
        showToast("Video deleted successfully", "success");
        navigate("/admin/videos");
      } else {
        showToast("Failed to delete video");
      }
    } catch (err) {
      showToast("Error deleting video");
    } finally {
      setLoading(false);
    }
  };

  if (loading || productsLoading) {
    return (
      <div className="mb-4 text-gray-500">
        <LoadingPage />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-2 sm:p-1">
      <h2 className="text-sm font-semibold mb-4 text-gray-900 dark:text-gray-100">
        {id ? "Update Video" : "Add New Video"}
      </h2>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Form Section */}
        <div className="w-full lg:w-1/2">
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            {(error || productsError) && (
              <div className="mb-4 p-2 bg-red-200 text-red-800 rounded">
                {error || productsError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium" htmlFor="title">
                  Video Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Enter video title"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium" htmlFor="platform">
                  Platform
                </label>
                <select
                  id="platform"
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="YouTube">YouTube</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium" htmlFor="url">
                  Video URL
                </label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Enter video URL"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium" htmlFor="productId">
                  Select Product
                </label>
                <select
                  id="productId"
                  name="productId"
                  value={formData.productId}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">-- Select a product (optional) --</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.productCode || product.name || product._id}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-between items-center gap-4">
                <Button type="submit" disabled={loading}>
                  {id ? "Update Video" : "Add Video"}
                </Button>

                {id && (
                  <Button type="button" onClick={() => setShowModal(true)}>
                    Delete
                  </Button>
                )}
              </div>
            </form>

            {/* Confirmation Modal */}
            <ConfirmationModal
              isOpen={showModal}
              title="Confirm Deletion"
              message="Are you sure you want to delete this video? This action cannot be undone."
              onConfirm={handleDelete}
              onCancel={() => setShowModal(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadVideoForm;
