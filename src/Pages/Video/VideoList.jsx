import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingPage from "../../components/Navbar/LoadingPage";
import NoDataFound from "../../components/Reusable/NoDataFound";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Reusable/Button";

const BASE_URL = "https://craft-cart-backend.vercel.app";

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/videos`);
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

    fetchVideos();
  }, []);

  if (loading) return <LoadingPage />;

  if (error)
    return <p className="text-center text-red-600">{<NoDataFound />}</p>;

  return (
    <div className="bg-gray-50 dark:bg-gray-900  sm:p-2 rounded">
      <h2 className="text-sm uppercase font-semibold mb-2 text-gray-900 dark:text-gray-100">
        Video List
      </h2>
      <ul className="space-y-4">
        {videos.map((video) => (
          <li
            key={video._id}
            className="bg-white dark:bg-gray-800 p-4 rounded shadow flex flex-col sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-bold text-lg">
                {video.productId?.name || "No Product Name"}
              </p>
              <p className="text-sm text-gray-500">
                Title:{" "}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {video.title}
                </span>
              </p>
              <p className="text-sm text-gray-500">
                Platform: {video.platform}
              </p>
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400  hover:text-yellow-400 dark:hover:text-yellow-400"
              >
                Watch Video
              </a>
            </div>
            <div className="mt-3 sm:mt-0">
              <Button onClick={() => navigate(`${video._id}`)}>Update</Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VideoList;
