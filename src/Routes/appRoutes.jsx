// AppRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AboutMe from "../Components/about";
import CategoryPage from "../Components/pages/categ"; // Correct import of CategoryPage 
import PostThoughtsPage from "../Components/pages/postThoughts";
import ViewBlogDetails from "../Components/pages/viewBlogDetails";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/about" />} />
      <Route path="/post-thoughts" element={<PostThoughtsPage />} />
      <Route path="/about" element={<AboutMe />} />
      <Route path="/blog/:blogId" element={<ViewBlogDetails />} />
      <Route path="/category/:id" element={<CategoryPage />} /> {/* Dynamic route for category */}
    </Routes>
  );
};

export default AppRoutes;
