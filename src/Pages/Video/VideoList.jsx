import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingPage from "../../components/Navbar/LoadingPage";
import NoDataFound from "../../components/Reusable/NoDataFound";
import ConfirmationModal from "../../components/Reusable/ConfirmationModal";
import { toast } from "react-toastify";

const BASE_URL = "https://craft-cart-backend.vercel.app";

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const fetchVideos = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/delivery-video`);
      if (res.data.success) {
        const list = res.data.data || [];
        setVideos(list);
        if (list.length === 0) setError("No videos found.");
      } else {
        setError("Failed to load videos.");
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching videos.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await axios.delete(
        `${BASE_URL}/api/delivery-video/${deleteId}`
      );
      if (res.data.success) {
        toast.success("Video deleted successfully");
        setVideos(videos.filter((v) => v._id !== deleteId));
      } else {
        toast.error(res.data.message || "Failed to delete video");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting video");
    } finally {
      setDeleteId(null);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  if (loading) return <LoadingPage />;
  if (error) return <NoDataFound message={error} />;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 sm:p-4 rounded">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Delivery Videos with Order Details
      </h2>

      <ul className="space-y-6">
        {videos.map((video) => {
          const order = video.orderId || {};
          const userId = order.userId;

          return (
            <li
              key={video._id}
              className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg flex flex-col sm:flex-row sm:justify-between"
            >
              <div className="w-full sm:w-2/3 space-y-2">
                <p>
                  <strong>Order ID:</strong>{" "}
                  <span className="text-blue-600">{order._id}</span>
                </p>
                {userId && (
                  <p>
                    <strong>Customer ID:</strong> {userId}
                  </p>
                )}
                {order.deliveryAddress && (
                  <p>
                    <strong>Address:</strong>{" "}
                    {`${order.deliveryAddress.street}, ${order.deliveryAddress.city}, ${order.deliveryAddress.state} - ${order.deliveryAddress.postalCode}, ${order.deliveryAddress.country}`}
                  </p>
                )}
                {order.deliveryAddress?.contact && (
                  <p>
                    <strong>Contact:</strong> {order.deliveryAddress.contact}
                  </p>
                )}
                <p>
                  <strong>Items:</strong>
                </p>
                <ul className="list-disc pl-6">
                  {order.items?.map((item, idx) => (
                    <li key={idx}>
                      {item.name} - ₹{item.price} × {item.quantity}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-400">
                  Uploaded At: {new Date(video.createdAt).toLocaleString()}
                </p>
                <video
                  src={video.video.url}
                  controls
                  preload="metadata"
                  loading="lazy"
                  className="w-full max-w-md rounded mt-2"
                />
              </div>

              <div className="mt-4 sm:mt-0 sm:ml-4 flex items-center">
                <button
                  onClick={() => setDeleteId(video._id)}
                  className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <ConfirmationModal
        isOpen={!!deleteId}
        title="Delete Delivery Video"
        message="Are you sure you want to delete this delivery video? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default VideoList;
