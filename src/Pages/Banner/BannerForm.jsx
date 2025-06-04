import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { showToast } from "../../components/Toast/Toast";
import LoadingPage from "../../components/Navbar/LoadingPage";
import ConfirmationModal from "../../components/Reusable/ConfirmationModal";
import Button from "../../components/Reusable/Button";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [couponsRes, templatesRes] = await Promise.all([
          axios.get("https://craft-cart-backend.vercel.app/api/coupons"),
          axios.get("https://craft-cart-backend.vercel.app/api/templates"),
        ]);
        if (couponsRes.data.success) setCoupons(couponsRes.data.data);
        if (templatesRes.data.success)
          setTemplates(templatesRes.data.templates);
      } catch {
        showToast("❌ Failed to load data");
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
      .get(`https://craft-cart-backend.vercel.app/api/banners/${id}`)
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
      })
      .catch(() => showToast("❌ Failed to fetch banner"))
      .finally(() => setLoading(false));
  }, [id, coupons, templates]);

  const handleSubmit = async () => {
    if (!selectedCoupon || !selectedTemplate) {
      showToast("Please select both coupon and template");
      return;
    }

    const bannerData = {
      couponId: selectedCoupon._id,
      templateId: selectedTemplate._id,
      offerText: `${selectedCoupon.discountPercentage}% OFF - Get up to ₹${selectedCoupon.maxDiscount} discount!`,
      imageUrl: selectedCoupon.product?.images?.[0]?.url || "",
      isActive,
    };

    try {
      setSubmitLoading(true);
      const url = `https://craft-cart-backend.vercel.app/api/banners/${
        id || ""
      }`;
      const method = isUpdateMode ? axios.put : axios.post;
      const res = await method(url, bannerData);
      showToast(res.data.message || "Banner saved", "success");
      if (!isUpdateMode) resetForm();
    } catch {
      showToast("❌ Failed to save banner");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `https://craft-cart-backend.vercel.app/api/banners/${id}`
      );
      showToast(res.data.message || "Banner deleted", "success");
      navigate("/admin/banners");
    } catch {
      showToast("❌ Failed to delete banner");
    }
  };

  const handleToggleStatus = async () => {
    try {
      const res = await axios.patch(
        `https://craft-cart-backend.vercel.app/api/banners/${id}/status`,
        {
          isActive: !isActive,
        }
      );
      setIsActive(!isActive);
      showToast(res.data.message || "Status updated", "success");
    } catch {
      showToast("❌ Failed to update status");
    }
  };

  const resetForm = () => {
    setSelectedCoupon(null);
    setSelectedTemplate(null);
    setGenerated(false);
    setIsUpdateMode(false);
    setIsActive(true);
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
    <section className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <header>
        <h1 className="text-2xl font-bold mb-6">
          {isUpdateMode ? "Update" : "Create"} Promotional Banner
        </h1>
      </header>

      <div className="mb-4">
        <label htmlFor="couponSelect" className="block font-medium mb-1">
          Select Coupon
        </label>
        <select
          id="couponSelect"
          className="w-full p-2 border rounded text-black"
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

      <div className="mb-4">
        <label htmlFor="templateSelect" className="block font-medium mb-1">
          Select Template
        </label>
        <select
          id="templateSelect"
          className="w-full p-2 border rounded text-black"
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

      {!generated && (
        <Button
          type="button"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded mb-6"
          onClick={() =>
            selectedCoupon && selectedTemplate && setGenerated(true)
          }
          aria-label="Generate Banner"
        >
          Generate Banner
        </Button>
      )}

      {generated && selectedCoupon && selectedTemplate && (
        <section aria-label="Banner Preview">
          <h2 className="text-xl font-semibold mb-3">Banner Preview</h2>
          <div className="w-full max-w-3xl mx-auto" style={getLayoutStyles()}>
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
              alt="Product visual"
              className="w-40 h-40 object-contain rounded"
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <Button
              type="button"
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
              onClick={handleSubmit}
              disabled={submitLoading}
              aria-label={isUpdateMode ? "Update Banner" : "Create Banner"}
            >
              {submitLoading
                ? "Saving..."
                : isUpdateMode
                ? "Update Banner"
                : "Create Banner"}
            </Button>

            {!isUpdateMode && (
              <Button
                type="button"
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
                onClick={resetForm}
                aria-label="Reset Form"
              >
                Reset Form
              </Button>
            )}

            {isUpdateMode && (
              <>
                <Button
                  type="button"
                  className={`${
                    isActive ? "bg-yellow-600" : "bg-blue-600"
                  } text-white py-2 px-4 rounded`}
                  onClick={() => setShowStatusModal(true)}
                  aria-label={
                    isActive ? "Deactivate Banner" : "Activate Banner"
                  }
                >
                  {isActive ? "Deactivate" : "Activate"}
                </Button>

                <Button
                  type="button"
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                  onClick={() => setShowDeleteModal(true)}
                  aria-label="Delete Banner"
                >
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
