import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Pagination from "../../components/Reusable/Pagination";
import NoDataFound from "../../components/Reusable/NoDataFound";
import LoadingPage from "../../components/Navbar/LoadingPage";
import ReusableTable from "../../components/Reusable/ReusableTable";
import Button from "../../components/Reusable/Button";

const PAGE_SIZE = 5;
const BASE_URL = "https://craft-cart-backend.vercel.app";

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${BASE_URL}/api/reviews?search=${encodeURIComponent(
            searchTerm
          )}&page=${page}&limit=${PAGE_SIZE}`
        );

        if (response.data.status === "success") {
          setReviews(response.data.reviews || []);
          setTotalPages(response.data.totalPages || 1);
        } else {
          setReviews([]);
          setTotalPages(1);
          setError("Failed to load reviews");
        }
      } catch (err) {
        setError("Failed to load reviews");
        setReviews([]);
        setTotalPages(1);
        console.error(err);
      }
      setLoading(false);
    };

    fetchReviews();
  }, [page, searchTerm]);

  // Optional local filtering if needed (useful if backend doesn't support search)
  const filteredReviews = reviews.filter(
    (r) =>
      r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-2 sm:p-2 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h2 className="text-sm uppercase font-semibold mb-2 text-gray-900 dark:text-gray-100 text-center sm:text-left">
        Review List
      </h2>

      {/* Search */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <input
          type="text"
          placeholder="Search by name or comment..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1); // Reset to page 1 on new search
          }}
          className="p-2 sm:p-1 border rounded w-full sm:max-w-xs
            text-gray-900 dark:text-gray-100
            bg-white dark:bg-gray-800
            border-gray-300 dark:border-gray-600
            placeholder-gray-500 dark:placeholder-gray-400
            transition-colors duration-300
            focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-700 dark:text-gray-300 mb-4">
          <LoadingPage />
        </p>
      )}

      {/* No Data */}
      {!loading && !error && filteredReviews.length === 0 && (
        <div className="text-center text-gray-700 dark:text-gray-300">
          <NoDataFound />
        </div>
      )}

      {/* Table */}
      {!loading && !error && filteredReviews.length > 0 && (
        <ReusableTable
          columns={[
            { header: "SN.", accessor: "sn", render: (_, i) => i + 1 },
            { header: "Name", accessor: "name" },
            { header: "Rating", accessor: "rating" },
            { header: "Comment", accessor: "comment" },
            {
              header: "Actions",
              accessor: "actions",
              render: (review) => (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/admin/reviews/edit/${review._id}`);
                  }}
                  className="text-sm px-2 py-1"
                >
                  Edit
                </Button>
              ),
            },
          ]}
          data={filteredReviews}
          onRowClick={(review) => navigate(`/admin/reviews/edit/${review._id}`)}
        />
      )}

      {/* Pagination */}
      {reviews.length > 0 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
};

export default ReviewList;
