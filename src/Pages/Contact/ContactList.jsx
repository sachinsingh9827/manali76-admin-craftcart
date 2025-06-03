import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Reusable/Button";
import ReusableTable from "../../components/Reusable/ReusableTable";
import axios from "axios";
import LoadingPage from "../../components/Navbar/LoadingPage";
const BASE_URL = "https://craft-cart-backend.vercel.app";
const ContactInfoAdmin = () => {
  const [contactList, setContactList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleEditClick = (contact) => {
    navigate("/admin/contact/edit", { state: { contactInfo: contact } });
  };

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/contact-info`);
        const contacts = res.data.data;

        setMessage(res.data.message || "No contact information found.");

        if (Array.isArray(contacts) && contacts.length > 0) {
          // Sort by updatedAt descending
          const sortedContacts = contacts.sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
          );
          setContactList(sortedContacts);
        } else {
          setContactList([]);
        }
      } catch (error) {
        console.error("Failed to fetch contact info:", error);
        setContactList([]);
        setMessage("Failed to load contact information.");
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  const columns = [
    { header: "Field", accessor: "label" },
    { header: "Value", accessor: "value" },
  ];

  const generateTableData = (contact) => [
    { label: "Phone", value: contact.phone || "-" },
    { label: "Email", value: contact.email || "-" },
    { label: "Instagram", value: contact.instagram || "-" },
    { label: "Facebook", value: contact.facebook || "-" },
    { label: "LinkedIn", value: contact.linkedin || "-" },
    { label: "Address", value: contact.address || "-" },
  ];

  return (
    <div className="max-w-full m-2 bg-white dark:bg-gray-800 shadow-md rounded-md p-4 border border-gray-200 dark:border-gray-700">
      <h2 className="text-sm uppercase font-bold text-[#004080] dark:text-yellow-400 text-center sm:text-left mb-4">
        Contact Us Info
      </h2>

      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          <LoadingPage />
        </p>
      ) : contactList.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          {message}
        </p>
      ) : (
        contactList.map((contact, index) => (
          <div
            key={contact._id}
            className="mb-8 border-t pt-4 border-gray-300 dark:border-gray-600"
          >
            <div className="flex flex-col sm:flex-row justify-between items-center mb-2">
              <p className="font-semibold">
                Contact #{index + 1} —{" "}
                <span
                  className={`${
                    contact.isActive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {contact.isActive ? "Active" : "Not Active"}
                </span>
              </p>
              <Button
                onClick={() => handleEditClick(contact)}
                className="px-6 py-2 mt-2 sm:mt-0"
              >
                Edit
              </Button>
            </div>
            <ReusableTable
              columns={columns}
              data={generateTableData(contact)}
              noDataMessage="No data found"
            />
          </div>
        ))
      )}
    </div>
  );
};

export default ContactInfoAdmin;
