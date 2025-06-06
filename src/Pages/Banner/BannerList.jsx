import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingPage from "../../components/Navbar/LoadingPage";
import Button from "../../components/Reusable/Button";
import NoDataFound from "../../components/Reusable/NoDataFound";
const BASE_URL = "https://craft-cart-backend.vercel.app";

const BannerList = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/banners`);
        if (res.data.success) {
          setBanners(res.data.banners);
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

  const getBannerStyles = (layout) => ({
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
    flexWrap: "wrap",
  });

  if (loading) return <LoadingPage />;
  if (error) return <p className="text-red-600 text-center">{error}</p>;

  return (
    <>
      {/* Heading */}
      <div className="px-4 sm:px-6 lg:px-8 mb-2">
        <h2 className="text-sm uppercase font-semibold text-gray-800 dark:text-gray-100">
          Banner List
        </h2>
      </div>

      {/* Banner List */}
      <div className="px-4 sm:px-6 lg:px-8">
        {banners.length === 0 ? (
          <NoDataFound />
        ) : (
          <div className=" w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-2xl px-1 sm:px-1 lg:px-1">
            {banners.map((banner) => (
              <div
                key={banner._id}
                className="w-full rounded-md overflow-hidden bg-white dark:bg-gray-900 shadow-md hover:shadow-lg dark:shadow-[0_4px_6px_rgba(255,255,255,0.15)] dark:hover:shadow-[0_8px_12px_rgba(255,255,255,0.25)] transition-shadow duration-300 mb-4"
              >
                <div
                  style={getBannerStyles(banner.templateId?.layout)}
                  className="flex items-center  w-full  text-left"
                >
                  {/* Image */}
                  <img
                    src={banner.imageUrl || "https://via.placeholder.com/150"}
                    alt="Banner"
                    className="w-24 h-24 object-cover rounded-md flex-shrink-0"
                  />

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-lg mb-1">
                      {banner.couponId?.discountPercentage}% OFF
                    </p>
                    <p className="text-sm text-wrap">
                      Get up to ₹{banner.couponId?.maxDiscount} discount with{" "}
                      <strong>{banner.couponId?.code}</strong> coupon!
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end p-3 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    onClick={() => navigate(`/admin/banners/${banner._id}`)}
                  >
                    Edit Banner
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default BannerList;
