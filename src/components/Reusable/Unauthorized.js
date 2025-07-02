// src/utils/Unauthorized.js
import React from "react";

const Unauthorized = () => {
  return (
    <div className="text-center mt-20">
      <h1 className="text-3xl font-bold text-red-600">403 - Unauthorized</h1>
      <p className="mt-2 text-lg">
        You don’t have permission to view this page.
      </p>
    </div>
  );
};

export default Unauthorized;
