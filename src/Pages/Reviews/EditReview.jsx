import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ConfirmationModal from "../../components/Reusable/ConfirmationModal";

export const BASE_URL = "https://craft-cart-backend.vercel.app";

const EditReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/reviews/review/${id}`);
        if (res.data.status === "success") {
          setReview(res.data.review);
        } else {
          setError(res.data.message || "Review not found.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch review.");
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [id]);

  const confirmDelete = async () => {
    try {
      const res = await axios.delete(
        `${BASE_URL}/api/reviews/products/${review.productObjectId}/reviews/${id}`
      );
      if (res.status === 200) {
        navigate("/admin/reviews");
      } else {
        setError(res.data.message || "Failed to delete review.");
      }
    } catch (err) {
      console.error(err);
      setError("Error deleting review.");
    } finally {
      setDeleteId(null);
    }
  };

  if (loading)
    return (
      <p className="text-center text-gray-700 dark:text-gray-300">Loading...</p>
    );
  if (!review)
    return (
      <p className="text-center text-red-500">{error || "Review not found."}</p>
    );

  return (
    <div>
      {" "}
      <h2 className="text-sm uppercase font-bold mb-6 text-gray-900 dark:text-white">
        Review Details
      </h2>
      <div className="w-full md:w-1/2  md:h-full p-4 rounded bg-gray-200 text-gray-600 text-sm font-medium dark:bg-gray-700 dark:text-gray-300">
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <strong className="block text-gray-700 dark:text-gray-400">
              Rating:
            </strong>
            <span>{review.rating}</span>
          </div>

          <div>
            <strong className="block text-gray-700 dark:text-gray-400">
              Created At:
            </strong>
            <span>{new Date(review.createdAt).toLocaleString()}</span>
          </div>

          <div className="md:col-span-2">
            <strong className="block text-gray-700 dark:text-gray-400">
              Comment:
            </strong>
            <textarea
              value={review.comment}
              readOnly
              rows={6}
              className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 resize-y"
            />
          </div>

          <div>
            <strong className="block text-gray-700 dark:text-gray-400">
              User Name:
            </strong>
            <span>{review.user?.name}</span>
          </div>

          <div>
            <strong className="block text-gray-700 dark:text-gray-400">
              User Email:
            </strong>
            <span>{review.user?.email}</span>
          </div>

          <div>
            <strong className="block text-gray-700 dark:text-gray-400">
              Product Name:
            </strong>
            <span>{review.productName}</span>
          </div>

          <div>
            <strong className="block text-gray-700 dark:text-gray-400">
              Product ID:
            </strong>
            <span>{review.productId}</span>
          </div>
        </div>

        <button
          onClick={() => setDeleteId(id)}
          className="mt-8 w-full sm:w-auto bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
        >
          Delete Review
        </button>

        <ConfirmationModal
          isOpen={!!deleteId}
          title="Delete Review"
          message="Are you sure you want to delete this review? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
        />
      </div>
    </div>
  );
};

export default EditReview;
