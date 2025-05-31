import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Reusable/Button";

const initialContactInfo = {
  address: "123 Craft St, Handmade City",
  phone: "+1 (234) 567-890",
  email: "support@craft-cart.com",
  instagram: "craftcart_insta",
  facebook: "craftcart_fb",
  linkedin: "craftcart_li",
};

const ContactInfoAdmin = () => {
  const [contactInfo] = useState(initialContactInfo);
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate("/admin/contact/edit", { state: { contactInfo } });
  };

  const renderField = (label, value, isUsername = false) => (
    <div className="flex flex-col mb-4 sm:mb-0">
      <span className="font-semibold text-gray-700 dark:text-yellow-400 mb-1">
        {label}
      </span>
      <span className="text-gray-900 dark:text-gray-300 break-words">
        {isUsername && value ? `@${value}` : value || "-"}
      </span>
    </div>
  );

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-md shadow-md  mx-auto mt-8">
      <h2 className="text-3xl font-bold mb-6 text-[#004080] dark:text-yellow-400 text-center">
        Contact Us Info
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 mb-6">
        {renderField("Phone", contactInfo.phone)}
        {renderField("Email", contactInfo.email)}
        {renderField("Instagram", contactInfo.instagram, true)}
        {renderField("Facebook", contactInfo.facebook)}
        {renderField("LinkedIn", contactInfo.linkedin)}
        {/* Empty grid item to keep layout consistent */}
        <div></div>
      </div>

      <div className="mb-6">
        <span className="font-semibold text-gray-700 dark:text-yellow-400 mb-1 block">
          Address
        </span>
        <p className="text-gray-900 dark:text-gray-300">
          {contactInfo.address}
        </p>
      </div>

      <div className="text-center">
        <Button
          onClick={handleEditClick}
          className="px-6 py-2 w-full sm:w-auto"
        >
          Edit Contact Info
        </Button>
      </div>
    </div>
  );
};

export default ContactInfoAdmin;
