import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Button from "../../components/Reusable/Button";

const ContactInfoForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const initialData = location.state?.contactInfo || {
    address: "",
    phone: "",
    email: "",
    instagram: "",
    facebook: "",
    linkedin: "",
  };

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

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Simulate API call to save contact info
      await axios.post("/api/contact-info", values);

      alert("Contact info saved successfully!");
      navigate("/admin/contact");
    } catch (error) {
      alert("Failed to save contact info.");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-auto p-6 bg-gray-100 dark:bg-gray-900 flex justify-center">
      <div className="w-full  bg-white dark:bg-gray-800 rounded-md shadow-md p-8">
        <h2 className="text-3xl font-bold mb-8 text-[#004080] dark:text-yellow-400 text-center">
          {location.state?.contactInfo
            ? "Update Contact Info"
            : "Add Contact Info"}
        </h2>

        <Formik
          enableReinitialize
          initialValues={initialData}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
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

              {/* Submit Button */}
              <div className="flex justify-center gap-2">
                <Button
                  onClick={handleCancelClick}
                  className="px-8 py-3 w-full sm:w-auto"
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
  );
};

export default ContactInfoForm;
