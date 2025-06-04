import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

const TemplateList = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTemplates = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/templates`);
      if (res.data.success) {
        setTemplates(res.data.templates);
      }
    } catch (error) {
      console.error("Failed to load templates", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this template?"))
      return;
    try {
      await axios.delete(`${BASE_URL}/api/templates/${id}`);
      setTemplates((prev) => prev.filter((template) => template._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete template.");
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
      animation,
    } = template.layout;

    const isVertical = imagePosition === "top" || imagePosition === "bottom";

    // Determine flex direction based on imagePosition
    const flexDirection = isVertical
      ? imagePosition === "top"
        ? "flex-col"
        : "flex-col-reverse"
      : imagePosition === "left"
      ? "flex-row"
      : "flex-row-reverse";

    // Map shape to CSS styles (example)
    const shapeStyles = {
      rectangle: {},
      circle: { borderRadius: "50%" },
      oval: { borderRadius: "50% / 100%" },
      banner: { borderRadius: borderRadius }, // Use borderRadius for banner or custom style
    };

    // Animation class map (you can add more or customize)
    const animationClasses = {
      pulse: "animate-pulse",
      bounce: "animate-bounce",
      "": "",
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
          animation: animation ? undefined : undefined, // if using CSS animations, replace here
        }}
      >
        <div className={`flex ${flexDirection} md:h-40`}>
          {/* Image Block */}
          <div
            className={`w-full md:w-1/2 h-32 md:h-full flex items-center justify-center bg-gray-200 text-gray-600 text-sm font-medium dark:bg-gray-700 dark:text-gray-300`}
          >
            [ Image ]
          </div>

          {/* Text Block */}
          <div
            className={`w-full md:w-1/2 flex items-center justify-${textPosition} px-4 py-2`}
            style={{
              textAlign: textPosition,
            }}
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
    <div className="p-4 max-w-full mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Offer Templates
        </h2>
        <button
          onClick={() => navigate("new")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + New Template
        </button>
      </div>

      {loading ? (
        <p className="text-gray-800 dark:text-gray-200">Loading templates...</p>
      ) : templates.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">No templates found.</p>
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
                  <button
                    onClick={() => navigate(`${template._id}`)}
                    className="bg-yellow-400 px-3 py-1 rounded text-black hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(template._id)}
                    className="bg-red-600 px-3 py-1 rounded text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateList;
