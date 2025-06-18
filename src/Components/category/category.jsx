import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { BASE_URL } from "../../config";

const CategoryPage = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/category/${id}`)
      .then((res) => res.json())
      .then((data) => setCategory(data))
      .catch((err) => console.error("Error fetching category details:", err));
  }, [id]);

  if (!category) return <div className="text-white">Loading category...</div>;

  return (
    <div className="text-white">
      <h2 className="text-2xl font-semibold mb-2">{category.categoryName}</h2>
      <p className="mb-4">{category.categoryDescription}</p>

      {category.blogs && category.blogs.length > 0 ? (
        <ul className="space-y-4">
          {category.blogs.map((blog) => (
            <li
              key={blog._id}
              className="border p-4 rounded bg-[#1a2233] hover:bg-[#22304a] transition"
            >
              <Link
                to={`/blog/${blog._id}`}
                className="block hover:underline text-blue-400"
              >
                <h3 className="text-lg font-bold">{blog.name}</h3>
                <p className="text-gray-400">{blog.readingTime} min read</p>
              </Link>
              <div className="mt-3">
                <Link
                  to={`/blog/${blog._id}`}
                  className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  View Blog
                </Link>
              </div>
            </li>
          ))}
        </ul>) : (
        <p className="text-gray-400">No blogs in this category.</p>
      )}
    </div>
  );
};

export default CategoryPage;