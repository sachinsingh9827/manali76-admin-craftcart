import React, { useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeContext } from "../../context/ThemeContext";

export const showToast = (message, type = "error") => {
  toast[type](message, {
    position: "bottom-right",
    className: "custom-toast",
    closeButton: false,
  });
};

const Toast = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <ToastContainer
      position="bottom-right"
      autoClose={2000}
      closeButton={false}
      newestOnTop={false}
      rtl={false}
      draggable
      pauseOnFocusLoss
      pauseOnHover
      theme={theme === "dark" ? "dark" : "light"}
      toastClassName="custom-toast"
    />
  );
};

export default Toast;
