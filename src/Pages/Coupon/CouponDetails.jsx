import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingPage from "../../components/Navbar/LoadingPage";
import NoDataFound from "../../components/Reusable/NoDataFound";
import Button from "../../components/Reusable/Button";
import { toast } from "react-toastify";

const BASE_URL = "https://craft-cart-backend.vercel.app";

const CouponDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCoupon = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/coupons/${id}`);
      if (res.data.success) {
        setCoupon(res.data.data);
      } else {
        toast.error("Failed to fetch coupon details");
      }
    } catch (error) {
      toast.error("Error fetching coupon details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupon();
  }, [id]);

  if (loading) return <LoadingPage />;
  if (!coupon) return <NoDataFound />;

  return (
    <div className="max-w-full  p-2 bg-white dark:bg-gray-900 rounded-lg shadow-md  border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
        Coupon Details
      </h2>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Coupon Info */}
        <div className="flex-1 space-y-3 text-gray-800 dark:text-gray-200 text-sm">
          <p>
            <strong>Coupon Name:</strong> {coupon.name}
          </p>
          <p>
            <strong>Coupon Code:</strong> {coupon.code}
          </p>
          <p>
            <strong>Discount Percentage:</strong> {coupon.discountPercentage}%
          </p>
          <p>
            <strong>Max Discount Amount:</strong> ₹{coupon.maxDiscount}
          </p>
          <p>
            <strong>Associated Product ID:</strong>{" "}
            {coupon.product?._id || "N/A"}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(coupon.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Updated At:</strong>{" "}
            {new Date(coupon.updatedAt).toLocaleString()}
          </p>

          <Button
            onClick={() => navigate("/admin/coupon")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Back to Coupons
          </Button>
        </div>

        {/* Button Section */}
      </div>
    </div>
  );
};

export default CouponDetails;
