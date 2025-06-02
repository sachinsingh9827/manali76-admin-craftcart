import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Button from "../../components/Reusable/Button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const BASE_URL = "https://craft-cart-backend.vercel.app";
const ContactInfoForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const contactInfo = location.state?.contactInfo || null;
  const isEditMode = Boolean(contactInfo);

  const initialData = contactInfo || {
    address: "",
    phone: "",
    email: "",
    instagram: "",
    facebook: "",
    linkedin: "",
  };

  const [isActive, setIsActive] = useState(contactInfo?.isActive ?? true);
  const [updating, setUpdating] = useState(false);

  // Yup validation schema
  const validationSchema = Yup.object({
    address: Yup.string().required("Address is required"),
    phone: Yup.string()
      .matches(/^\+?\d{7,15}$/, "Enter a valid phone number")
      .required("Phone is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    instagram: Yup.string(),
    facebook: Yup.string(),
    linkedin: Yup.string(),
  });

  const handleCancelClick = () => {
    navigate(-1);
  };

  const toggleAvailability = async () => {
    if (!contactInfo?._id) return;

    setUpdating(true);
    try {
      const response = await axios.patch(
        `${BASE_URL}/api/contact-info/toggle-active/${contactInfo._id}`
      );
      setIsActive(response.data.data.isActive);
      toast.success(
        `Contact has been ${
          response.data.data.isActive ? "activated" : "deactivated"
        } successfully`
      );
    } catch (error) {
      toast.error("Failed to update contact status.");
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (isEditMode) {
        // Update existing contact info by ID
        await axios.put(
          `${BASE_URL}/api/contact-info/toggle-active/${contactInfo._id}`,
          values
        );
        toast.success("Contact info updated successfully!");
      } else {
        // Add new contact info
        await axios.post(`${BASE_URL}/api/contact-info`, values);
        toast.success("Contact info added successfully!");
      }
      navigate("/admin/contact");
    } catch (error) {
      toast.error("Failed to save contact info.");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-auto p-2 bg-gray-100 dark:bg-gray-900 flex justify-center">
        <div className="w-full bg-white dark:bg-gray-800 rounded-md shadow-md p-8 ">
          <h2 className="text-sm uppercase font-bold mb-8 text-[#004080] dark:text-yellow-400 text-start">
            {isEditMode ? "Update Contact Info" : "Add Contact Info"}
          </h2>

          <Formik
            enableReinitialize
            initialValues={initialData}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                {/* Phone & Email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block font-medium mb-1 dark:text-white"
                    >
                      Phone
                    </label>
                    <Field
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-yellow-400 rounded focus:outline-none focus:ring-2 focus:ring-[#004080] dark:bg-gray-700 dark:text-white"
                      placeholder="+1234567890"
                    />
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="text-red-600 mt-1 text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block font-medium mb-1 dark:text-white"
                    >
                      Email
                    </label>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-yellow-400 rounded focus:outline-none focus:ring-2 focus:ring-[#004080] dark:bg-gray-700 dark:text-white"
                      placeholder="you@example.com"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-600 mt-1 text-sm"
                    />
                  </div>
                </div>

                {/* Instagram & Facebook row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="instagram"
                      className="block font-medium mb-1 dark:text-white"
                    >
                      Instagram Username
                    </label>
                    <Field
                      type="text"
                      id="instagram"
                      name="instagram"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-yellow-400 rounded focus:outline-none focus:ring-2 focus:ring-[#004080] dark:bg-gray-700 dark:text-white"
                      placeholder="e.g. craftcart_insta"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="facebook"
                      className="block font-medium mb-1 dark:text-white"
                    >
                      Facebook Username or Page
                    </label>
                    <Field
                      type="text"
                      id="facebook"
                      name="facebook"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-yellow-400 rounded focus:outline-none focus:ring-2 focus:ring-[#004080] dark:bg-gray-700 dark:text-white"
                      placeholder="e.g. craftcart_fb"
                    />
                  </div>
                </div>

                {/* LinkedIn single row */}
                <div>
                  <label
                    htmlFor="linkedin"
                    className="block font-medium mb-1 dark:text-white"
                  >
                    LinkedIn Username or Page
                  </label>
                  <Field
                    type="text"
                    id="linkedin"
                    name="linkedin"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-yellow-400 rounded focus:outline-none focus:ring-2 focus:ring-[#004080] dark:bg-gray-700 dark:text-white"
                    placeholder="e.g. craftcart_li"
                  />
                </div>

                {/* Address single row (textarea) */}
                <div>
                  <label
                    htmlFor="address"
                    className="block font-medium mb-1 dark:text-white"
                  >
                    Address
                  </label>
                  <Field
                    as="textarea"
                    id="address"
                    name="address"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-yellow-400 rounded resize-none focus:outline-none focus:ring-2 focus:ring-[#004080] dark:bg-gray-700 dark:text-white"
                    placeholder="Enter address"
                  />
                  <ErrorMessage
                    name="address"
                    component="div"
                    className="text-red-600 mt-1 text-sm"
                  />
                </div>

                {/* Toggle Active Status Button */}
                {isEditMode && (
                  <div className="mb-4">
                    {/* Status Text */}
                    <p
                      className={`mb-2 font-semibold ${
                        isActive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      Status: {isActive ? "Active" : "Not Active"}
                    </p>

                    {/* Toggle Button */}
                    <Button
                      onClick={toggleAvailability}
                      disabled={updating}
                      className={`px-8 py-3 w-full sm:w-auto ${
                        isActive
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-red-600 hover:bg-red-700"
                      } text-white`}
                      type="button"
                    >
                      {updating
                        ? "Updating..."
                        : isActive
                        ? "Mark as Not Active"
                        : "Mark as Active"}
                    </Button>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end gap-2">
                  <Button
                    onClick={handleCancelClick}
                    className="px-8 py-3 w-full sm:w-auto"
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 w-full sm:w-auto"
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default ContactInfoForm;
