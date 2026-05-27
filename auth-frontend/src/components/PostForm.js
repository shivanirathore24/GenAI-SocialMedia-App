import { useState } from "react";

import api from "../api/axios";

import { toast } from "react-toastify";

import { usePosts } from "../context/PostContext";

function PostForm() {
  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(false);

  const { setPosts } = usePosts();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      return toast.error("Post cannot be empty");
    }

    try {
      setLoading(true);

      const res = await api.post("/api/posts", {
        content,
      });

      // 🔥 Update Context Instantly
      setPosts((prevPosts) => [res.data.data, ...prevPosts]);

      // Clear textarea
      setContent("");

      toast.success("Post created successfully 🎉");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create post";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow border-0 rounded-4 p-4 mb-4">
      <h4 className="fw-bold mb-3">Create Post</h4>

      <form onSubmit={handleSubmit}>
        {/* Textarea */}
        <div className="mb-3">
          <textarea
            className="form-control rounded-3"
            rows="4"
            placeholder="What's happening?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={280}
          />
        </div>

        {/* Footer */}
        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted">{content.length}/280 characters</small>

          <button
            type="submit"
            className="btn btn-dark rounded-pill px-4"
            disabled={loading}
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PostForm;
