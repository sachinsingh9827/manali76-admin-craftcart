import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { showToast } from "../../components/Toast/Toast";
import LoadingPage from "../../components/Navbar/LoadingPage";
import ConfirmationModal from "../../components/Reusable/ConfirmationModal";
import Button from "../../components/Reusable/Button";
const BASE_URL = "https://craft-cart-backend.vercel.app";

const AdminBannerGenerator = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [coupons, setCoupons] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [generated, setGenerated] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [initialForm, setInitialForm] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [couponsRes, templatesRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/coupons`),
          axios.get(`${BASE_URL}/api/templates`),
        ]);
        if (couponsRes.data.success) setCoupons(couponsRes.data.data);
        if (templatesRes.data.success)
          setTemplates(templatesRes.data.templates);
      } catch {
        showToast("Failed to load data", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!id || coupons.length === 0 || templates.length === 0) return;

    setIsUpdateMode(true);
    setLoading(true);

    axios
      .get(`${BASE_URL}/api/banners/${id}`)
      .then((res) => {
        const banner = res.data.banner;
        const foundCoupon = coupons.find((c) => c._id === banner.couponId._id);
        const foundTemplate = templates.find(
          (t) => t._id === banner.templateId._id
        );

        setSelectedCoupon(foundCoupon || null);
        setSelectedTemplate(foundTemplate || null);
        setGenerated(true);
        setIsActive(banner.isActive);

        // ✅ Track initial form state
        setInitialForm({
          couponId: foundCoupon?._id,
          templateId: foundTemplate?._id,
          isActive: banner.isActive,
        });
      })
      .catch(() => {
        showToast("Failed to fetch banner", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, coupons, templates]);

  const handleSubmit = async () => {
    if (!selectedCoupon || !selectedTemplate) {
      showToast("Please select both coupon and template", "warning");
      return;
    }

    const currentForm = {
      couponId: selectedCoupon._id,
      templateId: selectedTemplate._id,
      isActive,
    };

    // ✅ Detect unchanged form values
    if (
      isUpdateMode &&
      initialForm &&
      currentForm.couponId === initialForm.couponId &&
      currentForm.templateId === initialForm.templateId &&
      currentForm.isActive === initialForm.isActive
    ) {
      showToast("No changes made", "info");
      return;
    }

    const bannerData = {
      ...currentForm,
      offerText: `${selectedCoupon.discountPercentage}% OFF - Get up to ₹${selectedCoupon.maxDiscount} discount!`,
      imageUrl: selectedCoupon.product?.images?.[0]?.url || "",
    };

    try {
      setSubmitLoading(true);
      const url = `${BASE_URL}/api/banners/${id || ""}`;
      const method = isUpdateMode ? axios.put : axios.post;
      const res = await method(url, bannerData);

      showToast(res.data.message || "Banner saved", "success");

      if (isUpdateMode) {
        navigate("/admin/banners");
      } else {
        resetForm();
      }
    } catch {
      showToast("Failed to save banner", "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`${BASE_URL}/api/banners/${id}`);
      showToast(res.data.message || "Banner deleted", "success");
      navigate("/admin/banners");
    } catch {
      showToast("Failed to delete banner", "error");
    }
  };

  const handleToggleStatus = async () => {
    try {
      const res = await axios.patch(`${BASE_URL}/api/banners/${id}/status`, {
        isActive: !isActive,
      });
      setIsActive(!isActive);
      showToast(res.data.message || "Status updated", "success");
    } catch {
      showToast("Failed to update status", "error");
    }
  };

  const resetForm = () => {
    setSelectedCoupon(null);
    setSelectedTemplate(null);
    setGenerated(false);
    setIsUpdateMode(false);
    setIsActive(true);
    setInitialForm(null);
  };

  const getLayoutStyles = () => {
    if (!selectedTemplate) return {};
    const layout = selectedTemplate.layout;
    return {
      display: "flex",
      flexDirection: layout.imagePosition === "right" ? "row" : "row-reverse",
      backgroundColor: layout.backgroundColor,
      color: layout.textColor,
      fontSize: layout.fontSize,
      borderRadius: layout.borderRadius,
      boxShadow: layout.boxShadow,
      padding: layout.padding,
      borderStyle: layout.borderStyle,
      borderWidth: layout.borderWidth,
      borderColor: layout.borderColor,
      alignItems: "center",
      gap: "1rem",
    };
  };

  if (loading) return <LoadingPage />;

  return (
    <section className="min-h-screen p-2 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-sm uppercase font-bold mb-6">
        {isUpdateMode ? "Update" : "Create"} Promotional Banner
      </h1>

      {/* Coupon Select */}
      <div className="p-4 border border-gray-300 dark:border-gray-600 rounded-md space-y-6">
        {/* Coupon Select */}
        <div className="mb-0">
          <label className="block font-medium mb-1 text-gray-900 dark:text-gray-100">
            Select Coupon
          </label>
          <select
            className="
        w-full p-2 rounded 
        border border-gray-300 dark:border-gray-600 
        text-black dark:text-white 
        bg-white dark:bg-gray-800
        focus:outline-none focus:ring-2 
        focus:ring-blue-500 dark:focus:ring-blue-400
        transition-colors duration-200
      "
            value={selectedCoupon?._id || ""}
            onChange={(e) => {
              const coupon = coupons.find((c) => c._id === e.target.value);
              setSelectedCoupon(coupon);
              setGenerated(false);
            }}
          >
            <option value="">-- Select Coupon --</option>
            {coupons.map((coupon) => (
              <option key={coupon._id} value={coupon._id}>
                {coupon.name} - {coupon.discountPercentage}% OFF
              </option>
            ))}
          </select>
        </div>

        {/* Template Select */}
        <div className="mb-0">
          <label className="block font-medium mb-1 text-gray-900 dark:text-gray-100">
            Select Template
          </label>
          <select
            className="
        w-full p-2 rounded 
        border border-gray-300 dark:border-gray-600 
        text-black dark:text-white 
        bg-white dark:bg-gray-800
        focus:outline-none focus:ring-2 
        focus:ring-blue-500 dark:focus:ring-blue-400
        transition-colors duration-200
      "
            value={selectedTemplate?._id || ""}
            onChange={(e) => {
              const template = templates.find((t) => t._id === e.target.value);
              setSelectedTemplate(template);
              setGenerated(false);
            }}
          >
            <option value="">-- Select Template --</option>
            {templates.map((template) => (
              <option key={template._id} value={template._id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!generated && (
        <Button
          type="button"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded mb-6"
          onClick={() =>
            selectedCoupon && selectedTemplate && setGenerated(true)
          }
        >
          Generate Banner
        </Button>
      )}

      {generated && selectedCoupon && selectedTemplate && (
        <section>
          <h2 className="text-sm uppercase mt-6 font-semibold mb-3">
            Banner Preview
          </h2>
          <div className="p-2 border border-gray-300 dark:border-gray-600 rounded-md space-y-6">
            <div
              className="w-full max-w-full mx-auto"
              style={getLayoutStyles()}
            >
              <div className="flex-1">
                <p className="font-bold mb-2">
                  {selectedCoupon.discountPercentage}% OFF
                </p>
                <p>
                  Get up to ₹{selectedCoupon.maxDiscount} off using{" "}
                  <strong>{selectedCoupon.name}</strong>
                </p>
              </div>
              <img
                src={
                  selectedCoupon.product?.images?.[0]?.url ||
                  "https://via.placeholder.com/150"
                }
                alt="Product"
                className="w-40 h-40 object-contain rounded"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={submitLoading}
            >
              {submitLoading ? "Saving..." : isUpdateMode ? "Update" : "Create"}
            </Button>

            {!isUpdateMode && (
              <Button type="button" onClick={resetForm}>
                Reset Form
              </Button>
            )}

            {isUpdateMode && (
              <>
                <Button type="button" onClick={() => setShowStatusModal(true)}>
                  {isActive ? "Deactivate" : "Activate"}
                </Button>

                <Button type="button" onClick={() => setShowDeleteModal(true)}>
                  Delete
                </Button>
              </>
            )}
          </div>
        </section>
      )}

      {/* Modals */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Confirm Deletion"
        message="Are you sure you want to delete this banner?"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
      <ConfirmationModal
        isOpen={showStatusModal}
        title={`Confirm ${isActive ? "Deactivation" : "Activation"}`}
        message={`Are you sure you want to ${
          isActive ? "deactivate" : "activate"
        } this banner?`}
        onConfirm={() => {
          handleToggleStatus();
          setShowStatusModal(false);
        }}
        onCancel={() => setShowStatusModal(false)}
      />
    </section>
  );
};

export default AdminBannerGenerator;
