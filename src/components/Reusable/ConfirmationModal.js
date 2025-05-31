import React from "react";
import Button from "./Button";

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-sm w-full p-6">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">{title}</h2>
        <p className="mb-6 text-gray-700 dark:text-gray-300">{message}</p>
        <div className="flex justify-end space-x-4">
          <Button
            onClick={onCancel}
            className="bg-gray dark:bg-gray text-gray-700 dark:text-gray-200 hover:bg-gray dark:hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
