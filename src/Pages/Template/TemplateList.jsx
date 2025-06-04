import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../../components/Reusable/Button";
import LoadingPage from "../../components/Navbar/LoadingPage";
import NoDataFound from "../../components/Reusable/NoDataFound";
import ConfirmationModal from "../../components/Reusable/ConfirmationModal";
import { showToast } from "../../components/Toast/Toast";
import offerImage from "../../assets/offerImage.jpeg";
const BASE_URL = "https://craft-cart-backend.vercel.app";

const TemplateList = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null); // for modal control
  const navigate = useNavigate();

  const fetchTemplates = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/templates`);
      if (res.data.success) {
        setTemplates(res.data.templates);
      }
    } catch (error) {
      console.error("Failed to load templates", error);
      showToast("Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const confirmDelete = (id) => {
    setDeleteId(id);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/templates/${deleteId}`);
      setTemplates((prev) => prev.filter((t) => t._id !== deleteId));
      showToast("Template deleted successfully", "success");
    } catch (err) {
      console.error("Delete failed", err);
      showToast("Failed to delete template");
    } finally {
      setDeleteId(null);
    }
  };

  const renderTemplateCard = (template) => {
    const {
      imagePosition,
      textPosition,
      backgroundColor,
      textColor,
      fontSize,
      borderRadius,
      boxShadow,
      padding,
      borderStyle,
      borderWidth,
      borderColor,
      shape,
    } = template.layout;

    const isVertical = imagePosition === "top" || imagePosition === "bottom";
    const flexDirection = isVertical
      ? imagePosition === "top"
        ? "flex-col"
        : "flex-col-reverse"
      : imagePosition === "left"
      ? "flex-row"
      : "flex-row-reverse";

    const shapeStyles = {
      rectangle: {},
      circle: { borderRadius: "50%" },
      oval: { borderRadius: "50% / 100%" },
      banner: { borderRadius },
    };

    return (
      <div
        className={`w-full overflow-hidden border`}
        style={{
          backgroundColor,
          color: textColor,
          fontSize,
          borderRadius: shapeStyles[shape]?.borderRadius || borderRadius,
          boxShadow,
          padding,
          borderStyle,
          borderWidth,
          borderColor,
        }}
      >
        <div className={`flex ${flexDirection} md:h-40`}>
          <div className="w-full md:w-1/2 h-32 md:h-full flex items-center justify-center bg-gray-200 text-gray-600 text-sm font-medium dark:bg-gray-700 dark:text-gray-300">
            <img
              src={offerImage}
              alt="Default Template"
              className="object-contain h-full"
            />
          </div>
          <div
            className={`w-full md:w-1/2 flex items-center justify-${textPosition} px-4 py-2`}
            style={{ textAlign: textPosition }}
          >
            <div>
              <p className="font-semibold">50% OFF</p>
              <p>Big Summer Sale</p>
              <p className="text-sm mt-1">Shop Now →</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-1 max-w-full mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm uppercase font-bold text-gray-900 dark:text-white">
          Templates
        </h2>
        <Button onClick={() => navigate("new")}>+ New Template</Button>
      </div>

      {loading ? (
        <LoadingPage />
      ) : templates.length === 0 ? (
        <NoDataFound />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template._id}
              className="bg-white dark:bg-gray-800 p-4 rounded shadow hover:shadow-lg transition"
            >
              <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">
                {template.name}
              </h3>
              {renderTemplateCard(template)}

              <div className="flex justify-between mt-3 text-sm">
                <span
                  className={`font-medium ${
                    template.isActive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {template.isActive ? "Active" : "Inactive"}
                </span>
                <div className="space-x-2">
                  <Button
                    onClick={() => navigate(`${template._id}`)}
                    className="bg-yellow-400 px-3 py-1 rounded text-black hover:bg-yellow-500"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => confirmDelete(template._id)}
                    className="bg-red-600 px-3 py-1 rounded text-white hover:bg-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteId}
        title="Delete Template"
        message="Are you sure you want to delete this template? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default TemplateList;
