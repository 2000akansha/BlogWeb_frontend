import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../config";
import axios from "axios";
import DOMPurify from "dompurify";

const ViewBlogDetails = () => {
    const { blogId } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/blog-category/view-blog-details/${blogId}`);
                setBlog(res.data?.data?.[0]?.blog);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [blogId]);

    if (loading) return <div className="text-white text-center text-2xl mt-20 animate-pulse">Loading...</div>;
    if (error) return <div className="text-red-500 text-center text-lg mt-20">Error: {error}</div>;
    if (!blog) return <div className="text-white text-center text-lg mt-20">No blog found.</div>;

    return (
        <div className="bg-[#0f172a] min-h-screen text-white font-sans">
            {/* Attachment Image at top */}
            {blog.attachment && (
                <div className="w-full flex justify-center items-center py-4">
                    <img
                        src={blog.attachment}
                        alt={blog.name}
                        className="max-h-[450px] w-auto object-contain rounded-2xl shadow-xl"
                    />
                </div>

            )}

            {/* Main Blog Content */}
            <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
                {/* Blog Title */}
                <h1 className="text-4xl font-bold text-white tracking-tight drop-shadow-md text-center">
                    {blog.name}
                </h1>

                {/* Full Content */}
                <div className="bg-[#1e293b]/60 p-8 rounded-2xl shadow-xl border border-gray-700">
                    <h2 className="text-2xl font-semibold mb-4 text-indigo-400">Full Content</h2>
                    <div
                        className="text-gray-200 text-lg leading-relaxed"
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(blog.content || "<i>No content available.</i>")
                        }}
                    />
                </div>

                {/* Metadata Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#1e293b]/60 p-6 rounded-xl shadow-md border border-gray-700">
                        <p><strong className="text-indigo-400">Category:</strong> {blog.categoryMasterId}</p>
                        <p><strong className="text-indigo-400">Author:</strong> {blog.name}</p>
                        <p><strong className="text-indigo-400">Reading Time:</strong> {blog.readingTime} min</p>
                    </div>
                    <div className="bg-[#1e293b]/60 p-6 rounded-xl shadow-md border border-gray-700">
                        <p><strong className="text-indigo-400">Tags:</strong> {blog.tags?.join(", ") || "N/A"}</p>
                        <p><strong className="text-indigo-400">Created:</strong> {new Date(blog.createdAt).toLocaleString()}</p>
                        <p><strong className="text-indigo-400">Updated:</strong> {new Date(blog.updatedAt).toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewBlogDetails;
