import React from "react";
import { Link } from "react-router-dom";
import CategoryLinks from "../category/categoryLink";
import PostThoughtButton from "../category/postThoughtsButton";

// Gradient background class
const gradientBgClass = "bg-gradient-to-r from-[#020213] to-[#091C38]";

const Header = ({ categories }) => {
  return (
    <header className={gradientBgClass}>
      <div className="container mx-auto text-center py-8">
        <h1 className="text-3xl sm:text-4xl font-semibold text-white">Photon</h1>
        {/* Navigation */}
        <div className="flex justify-between items-center mt-6 text-white">
          <div className="flex items-center space-x-4">
            <Link to="/about">
              <button className="text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-300">
                About
              </button>
            </Link>

            {/* Dynamic Categories */}
            <CategoryLinks categories={categories} />
          </div>

          {/* Post Your Thoughts Button */}
          <PostThoughtButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
