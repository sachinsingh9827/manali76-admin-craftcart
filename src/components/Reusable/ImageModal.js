import React from "react";
import Button from "./Button";

const ImageModal = ({ isOpen, imageUrl, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
      onClick={onClose}
    >
      <div
        className="bg-white p-2 rounded shadow-xl w-[90%] max-w-sm relative"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt="Enlarged"
          className="w-full h-auto object-contain rounded"
        />
        <Button onClick={onClose} className="mt-2">
          Close
        </Button>
      </div>
    </div>
  );
};

export default ImageModal;
