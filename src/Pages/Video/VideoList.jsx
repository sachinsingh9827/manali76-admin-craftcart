import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingPage from "../../components/Navbar/LoadingPage";
import NoDataFound from "../../components/Reusable/NoDataFound";
import { toast } from "react-toastify";

const BASE_URL = "https://craft-cart-backend.vercel.app";

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchVideos = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/delivery-video`);
      if (res.data.success) {
        setVideos(res.data.data || []);
        if (!res.data.data || res.data.data.length === 0) {
          setError("No videos found.");
        }
      } else {
        setError("Failed to load videos");
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching videos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    try {
      const res = await axios.delete(`${BASE_URL}/api/delivery-video/${id}`);
      if (res.data.success) {
        toast.success("Video deleted successfully");
        setVideos((prev) => prev.filter((v) => v._id !== id));
      } else {
        toast.error("Failed to delete video");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting video");
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  if (loading) return <LoadingPage />;
  if (error) return <NoDataFound message={error} />;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 sm:p-2 rounded">
      <h2 className="text-sm uppercase font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Delivery Videos
      </h2>

      <ul className="space-y-4">
        {videos.map((video) => (
          <li
            key={video._id}
            className="bg-white dark:bg-gray-800 p-4 rounded shadow flex flex-col sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="w-full sm:w-2/3">
              <p className="font-semibold text-gray-800 dark:text-white">
                Order ID: <span className="text-blue-600">{video.orderId}</span>
              </p>
              <p className="text-xs text-gray-500 mb-2">
                Uploaded At: {new Date(video.createdAt).toLocaleString()}
              </p>
              <video
                src={video.videoUrl}
                controls
                className="w-full max-w-md rounded shadow"
              />
            </div>

            <div className="mt-3 sm:mt-0 sm:ml-4 flex flex-col gap-2">
              <button
                onClick={() => handleDelete(video._id)}
                className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VideoList;
