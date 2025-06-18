import React, { forwardRef } from "react";

const CustomDateInput = forwardRef(({ value, onClick }, ref) => (
  <input
  className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
  type="text"
  value={value}
  onClick={onClick}
  placeholder="Select Month and Year"
/>
));

export default CustomDateInput;
