import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const CategoryLinks = ({ categories }) => {
  const location = useLocation();
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  // Set active tab from URL if user refreshes or comes via deep link
  useEffect(() => {
    if (location.pathname.startsWith("/category/")) {
      const idFromPath = location.pathname.split("/category/")[1];
      setActiveCategoryId(idFromPath);
    }
  }, [location.pathname]);

  const handleClick = (id) => {
    setActiveCategoryId(id); // Update the active tab on click
  };

  return (
    <div className="flex items-center space-x-4 flex-wrap">
      {categories.map((cat) => {
        const isActive = activeCategoryId === cat._id;

        return (
          <Link to={`/category/${cat._id}`} key={cat._id} onClick={() => handleClick(cat._id)}>
            <div
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 transform cursor-pointer
                ${isActive
                  ? "bg-indigo-600 text-white shadow-2xl scale-105 translate-y-[-2px] ring-2 ring-indigo-400"
                  : "bg-[#1e293b] text-gray-300 hover:bg-[#334155] hover:shadow-md hover:-translate-y-1 hover:scale-105"
                }`}
            >
              {cat.categoryName?.trim()}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default CategoryLinks;
