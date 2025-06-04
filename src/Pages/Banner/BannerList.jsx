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
      {/* Heading in separate div */}
      <div className="px-4 mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Banner List
        </h2>
      </div>

      {/* Banner List Container */}
      <div className="p-4 max-w-full w-full mx-auto">
        {banners.length === 0 ? (
          <NoDataFound />
        ) : (
          <div className="flex flex-col gap-6">
            {banners.map((banner) => (
              <div
                key={banner._id}
                className="
            rounded-md overflow-hidden bg-white dark:bg-gray-900 
            shadow-md hover:shadow-lg 
            dark:shadow-[0_4px_6px_rgba(255,255,255,0.15)] 
            dark:hover:shadow-[0_8px_12px_rgba(255,255,255,0.25)] 
            transition-shadow duration-300
          "
              >
                <div
                  style={getBannerStyles(banner.templateId?.layout)}
                  className="flex items-start gap-4 w-full p-4 text-left"
                >
                  {/* Banner Text */}
                  <div className="flex-1 min-w-[200px]">
                    <p className="font-bold text-lg mb-2">
                      {banner.couponId?.discountPercentage}% OFF
                    </p>
                    <p className="text-sm">
                      Get up to ₹{banner.couponId?.maxDiscount} discount with{" "}
                      <strong>{banner.couponId?.code}</strong> coupon!
                    </p>
                  </div>

                  {/* Banner Image */}
                  <img
                    src={banner.imageUrl || "https://via.placeholder.com/150"}
                    alt="Banner"
                    className="w-36 h-36 object-contain rounded-md"
                  />
                </div>

                {/* Footer actions */}
                <div className="flex justify-end p-3 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    onClick={() => navigate(`/admin/banners/${banner._id}`)}
                    className=""
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
