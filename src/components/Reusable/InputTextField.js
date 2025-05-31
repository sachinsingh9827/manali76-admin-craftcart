// components/Reusable/InputTextField.jsx
import React from "react";

const InputTextField = ({
  label,
  type = "text",
  value,
  onChange,
  readOnly = false,
  id,
  required = false,
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block mb-1 font-medium text-gray-900 dark:text-gray-200"
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        required={required}
        className={`w-full px-3 py-2 rounded border 
          ${
            readOnly
              ? "bg-gray-100 cursor-not-allowed dark:bg-gray-700"
              : "bg-white dark:bg-gray-700"
          }
          border-gray-300 dark:border-gray-600
          text-gray-900 dark:text-gray-100`}
      />
    </div>
  );
};

export default InputTextField;
