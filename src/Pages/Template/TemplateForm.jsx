import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../components/Reusable/Button";
import { showToast } from "../../components/Toast/Toast";

const BASE_URL = "https://craft-cart-backend.vercel.app";

const TemplateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [templateData, setTemplateData] = useState({
    name: "",
    layout: {
      imagePosition: "left",
      textPosition: "right",
      backgroundColor: "#ffffff",
      textColor: "#000000",
      fontSize: "18px",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      padding: "1rem",
      borderStyle: "solid",
      borderWidth: "1px",
      borderColor: "#ddd",
      shape: "rectangle",
      animation: "",
    },
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (id) {
      axios
        .get(`${BASE_URL}/api/templates/${id}`)
        .then((res) => {
          if (res.data.success) {
            setTemplateData(res.data.template);
          } else {
            showToast("Failed to fetch template");
          }
        })
        .catch(() => showToast(" Error fetching template"));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name in templateData.layout) {
      setTemplateData((prev) => ({
        ...prev,
        layout: {
          ...prev.layout,
          [name]: value,
        },
      }));
    } else {
      setTemplateData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCheckboxChange = (e) => {
    setTemplateData((prev) => ({
      ...prev,
      isActive: e.target.checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      if (id) {
        response = await axios.put(
          `${BASE_URL}/api/templates/${id}`,
          templateData
        );
      } else {
        response = await axios.post(`${BASE_URL}/api/templates`, templateData);
      }

      if (response.data.success) {
        showToast(` ${response.data.message || "Template saved!"}`, "success");
        setMessage(response.data.message);
        setTimeout(() => navigate("/admin/templates"), 1500);
      } else {
        showToast(response.data.message || "❌ Operation failed");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "❌ Something went wrong!";
      showToast(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <h2 className="text-sm font-bold mb-4 text-gray-800 dark:text-white uppercase">
        {id ? "Edit Template" : "Create Template"}
      </h2>
      <div className="p-6 max-w-full mx-auto bg-white dark:bg-gray-800 shadow-md rounded-md">
        {message && (
          <div
            className={`mb-4 p-2 rounded ${
              message.type === "success"
                ? "bg-green-200 text-green-800"
                : "bg-red-200 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={templateData.name}
            onChange={handleChange}
            placeholder="Template Name"
            className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white px-4 py-2 rounded"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            {/* Position selects */}
            <select
              name="imagePosition"
              value={templateData.layout.imagePosition}
              onChange={handleChange}
              className="border px-2 py-2 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="left">Image Left</option>
              <option value="right">Image Right</option>
              <option value="center">Image Center</option>
              <option value="top">Image Top</option>
              <option value="bottom">Image Bottom</option>
            </select>

            <select
              name="textPosition"
              value={templateData.layout.textPosition}
              onChange={handleChange}
              className="border px-2 py-2 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="left">Text Left</option>
              <option value="right">Text Right</option>
              <option value="center">Text Center</option>
            </select>

            {/* Colors */}
            <input
              type="color"
              name="backgroundColor"
              value={templateData.layout.backgroundColor}
              onChange={handleChange}
              className="w-full"
              title="Background Color"
            />

            <input
              type="color"
              name="textColor"
              value={templateData.layout.textColor}
              onChange={handleChange}
              className="w-full"
              title="Text Color"
            />

            {/* Font size */}
            <input
              type="text"
              name="fontSize"
              value={templateData.layout.fontSize}
              onChange={handleChange}
              placeholder="Font Size (e.g., 18px)"
              className="border px-2 py-2 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />

            {/* Border Radius */}
            <input
              type="text"
              name="borderRadius"
              value={templateData.layout.borderRadius}
              onChange={handleChange}
              placeholder="Border Radius (e.g., 8px)"
              className="border px-2 py-2 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />

            {/* Box Shadow */}
            <input
              type="text"
              name="boxShadow"
              value={templateData.layout.boxShadow}
              onChange={handleChange}
              placeholder="Box Shadow (e.g., 0 2px 8px rgba(0,0,0,0.1))"
              className="col-span-2 border px-2 py-2 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />

            {/* Padding */}
            <input
              type="text"
              name="padding"
              value={templateData.layout.padding}
              onChange={handleChange}
              placeholder="Padding (e.g., 1rem)"
              className="border px-2 py-2 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />

            {/* Border Style */}
            <select
              name="borderStyle"
              value={templateData.layout.borderStyle}
              onChange={handleChange}
              className="border px-2 py-2 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
              <option value="double">Double</option>
              <option value="none">None</option>
            </select>

            {/* Border Width */}
            <input
              type="text"
              name="borderWidth"
              value={templateData.layout.borderWidth}
              onChange={handleChange}
              placeholder="Border Width (e.g., 1px)"
              className="border px-2 py-2 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />

            {/* Border Color */}
            <input
              type="color"
              name="borderColor"
              value={templateData.layout.borderColor}
              onChange={handleChange}
              className="w-full"
              title="Border Color"
            />

            {/* Shape */}
            <select
              name="shape"
              value={templateData.layout.shape}
              onChange={handleChange}
              className="border px-2 py-2 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="rectangle">Rectangle</option>
              <option value="circle">Circle</option>
              <option value="oval">Oval</option>
              <option value="banner">Banner</option>
            </select>

            {/* Animation */}
            <input
              type="text"
              name="animation"
              value={templateData.layout.animation}
              onChange={handleChange}
              placeholder="Animation (e.g., pulse, bounce)"
              className="col-span-2 border px-2 py-2 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>

          {/* Active Checkbox */}
          <label className="flex items-center gap-2 text-gray-800 dark:text-white">
            <input
              type="checkbox"
              checked={templateData.isActive}
              onChange={handleCheckboxChange}
            />
            Active Template
          </label>

          {/* Submit Button */}
          <Button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Saving..." : id ? "Update Template" : "Create Template"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default TemplateForm;
