import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingPage from "../../components/Navbar/LoadingPage";
import Button from "../../components/Reusable/Button";
import NoDataFound from "../../components/Reusable/NoDataFound";

const BannerList = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get(
          "https://craft-cart-backend.vercel.app/api/banners"
        );
        if (res.data.success) {
          setBanners(res.data.banners); // ✅ fix here
        } else {
          setError("Failed to load banners");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching banners");
      }
      setLoading(false);
    };

    fetchBanners();
  }, []);

  const getBannerStyles = (layout) => {
    return {
      display: "flex",
      flexDirection: layout?.imagePosition === "right" ? "row" : "row-reverse",
      backgroundColor: layout?.backgroundColor || "#f3f3f3",
      color: layout?.textColor || "#000",
      fontSize: layout?.fontSize || "16px",
      borderRadius: layout?.borderRadius || "0",
      boxShadow: layout?.boxShadow || "none",
      padding: layout?.padding || "1rem",
      borderStyle: layout?.borderStyle || "solid",
      borderWidth: layout?.borderWidth || "1px",
      borderColor: layout?.borderColor || "#ccc",
      alignItems: "center",
      gap: "1rem",
      marginBottom: "1rem",
    };
  };

  if (loading)
    return (
      <p>
        <LoadingPage />
      </p>
    );
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-1">
      <h2 className="text-sm uppercase font-semibold mb-2 text-gray-900 dark:text-gray-100 text-center sm:text-left ">
        Banner List
      </h2>

      {banners.length === 0 ? (
        <p>
          <NoDataFound />
        </p>
      ) : (
        banners.map((banner) => (
          <div
            key={banner._id}
            className="rounded-md shadow-md overflow-hidden bg-white dark:bg-gray-800 mb-4"
          >
            <div
              style={getBannerStyles(banner.templateId?.layout)}
              className="w-full"
            >
              <div className="flex-1">
                <p className="font-bold mb-2 text-lg">
                  {banner.couponId?.discountPercentage}% OFF
                </p>
                <p>
                  Get up to ₹{banner.couponId?.maxDiscount} discount with{" "}
                  <strong>{banner.couponId?.name}</strong> coupon!
                </p>
              </div>
              <img
                src={banner.imageUrl || "https://via.placeholder.com/150"}
                alt="Banner Preview"
                className="w-40 h-40 object-contain rounded"
              />
            </div>

            <div className="flex justify-end p-3 border-t border-gray-200 dark:border-gray-700">
              <Button
                onClick={() => navigate(`${banner._id}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white  rounded text-sm"
              >
                Edit Banner
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default BannerList;
