import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { BASE_URL } from "../../config";
import axios from "axios";

const CategoryPage = () => {
  const { id } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.post(`${BASE_URL}/blog-category/get-all-blog-list/${id}`);
        const categories = res.data?.data[0]?.categories || [];
        setBlogs(categories);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [id]);

  return (
    <div className="text-white">
      {blogs.length > 0 && (
        <h2 className="text-2xl font-semibold mb-4">Blogs in This Category</h2>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-400">Error: {error}</p>
      ) : blogs.length === 0 ? (
        <div className="flex justify-center items-center">
          <h2 className="text-2xl font-semibold mb-4">No Blogs in this Category</h2>
          <img
            src="/assets/img/Animation - 1745935297689.gif"
            alt="No blogs found"
            className="w-40 h-40"
          />
        </div>
      ) : (
        <ul className="space-y-6">
          {blogs.map((blog) => (
            <li
              key={blog._id}
              className="flex gap-6 items-start border p-4 rounded-md bg-[#111827]"
            >
              {/* Left: Image */}
              <div className="w-40 h-40 flex-shrink-0">
                {blog.attachment ? (
                  <img
                    src={blog.attachment}
                    alt={blog.name}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center text-sm text-gray-400 rounded">
                    No Image
                  </div>
                )}
              </div>
              {/* Right: Blog Info */}
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">{blog.name}</h3>
                <div
                  className="text-sm text-gray-400 mb-2"
                  dangerouslySetInnerHTML={{ __html: blog.description }}
                />
                <p className="text-sm text-gray-500">
                  <strong>Reading time:</strong> {blog.readingTime} min
                </p>
                <p className="text-xs text-gray-600">
                  <strong>Published:</strong>{" "}
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>
                <Link
                  to={`/blog/${blog._id}`}
                  className="inline-block mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  View Blog
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryPage;