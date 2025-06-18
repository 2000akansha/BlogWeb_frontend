import React, { useState } from "react";
import { BASE_URL } from "../../config";
import RichTextEditor from "../../Components/editor/editor"; // adjust path if needed

function PostThoughtModal({ open, onClose, categories }) {
  const [formData, setFormData] = useState({
    name: "",
    categoryMasterId: "",
    description: "",
    content: "",
    attachement: [], // Multiple files
  });
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const selectedFiles = Array.from(files);
      const imageFiles = selectedFiles.filter((file) => file.type.startsWith("image/"));

      setImagePreviews((prev) => [
        ...prev,
        ...imageFiles.map((file) => URL.createObjectURL(file)),
      ]);

      // Append to existing files instead of replacing
      setFormData((prev) => ({
        ...prev,
        attachement: [...prev.attachement, ...imageFiles],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    // Append all fields except attachments
    for (const key in formData) {
      if (key !== "attachement") {
        data.append(key, formData[key]);
      }
    }

    // Append files (all under the same key: "attachement")
    formData.attachement.forEach((file) => {
      data.append("attachement", file);
    });

    // Log form content
    for (let pair of data.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const response = await fetch(`${BASE_URL}/blog-category/add-blog`, {
        method: "POST",
        body: data,
      });

      if (!response.ok) throw new Error("Failed to post");

      alert("Post submitted successfully!");
      onClose();
    } catch (err) {
      console.error("Error submitting post:", err);
      alert("Error submitting post.");
    }
  };

  const handleFileRemove = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      attachement: prev.attachement.filter((_, i) => i !== index),
    }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="glass-modal p-6 w-[90%] md:w-[500px]"
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        }}
      >
        <h2 className="text-2xl font-bold mb-4 text-white">Post Your Thoughts</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Title"
            className="w-full p-2 rounded bg-transparent text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
          />

          <select
            name="categoryMasterId"
            className="w-full p-2 rounded bg-transparent text-white placeholder-white/70 border border-white/30 focus:outline-none"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              color: "#000", // Ensure text contrast
              paddingLeft: "10px",
            }}
            onChange={handleChange}
          >
            <option value="" style={{ color: "#000" }}>Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id} style={{ color: "#000" }}>
                {cat.categoryName}
              </option>
            ))}
          </select>

          <input
            name="description"
            placeholder="Description"
            className="w-full p-2 rounded bg-transparent text-white placeholder-white/70 border border-white/30"
            onChange={handleChange}
          />
          <textarea
            name="content"
            placeholder="Write your thoughts here..."
            rows="4"
            className="w-full p-2 rounded bg-transparent text-white placeholder-white/70 border border-white/30"
            onChange={handleChange}
          />
          {/* <RichTextEditor
            value={formData.content}
            onChange={(newContent) =>
              setFormData((prev) => ({ ...prev, content: newContent }))
            }
          /> */}
          <input
            type="file"
            name="attachement"
            accept="image/*"  // Restrict to image files only
            className="text-white"
            onChange={handleChange}
            multiple  // Allow multiple file selection
          />

          {imagePreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {imagePreviews.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Image Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 text-white bg-black bg-opacity-50 rounded-full p-1"
                    onClick={() => handleFileRemove(index)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="text-white border border-white/30 px-4 py-2 rounded hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostThoughtModal;
