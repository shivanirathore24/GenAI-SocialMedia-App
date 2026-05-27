import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";

function Home() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  // Create Post States
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // Posts State
  const [posts, setPosts] = useState([]);

  // Check Authentication
  useEffect(() => {
    const token = localStorage.getItem("token");

    // Redirect if token missing
    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    try {
      // Decode JWT payload
      const payload = JSON.parse(atob(token.split(".")[1]));

      setUser(payload);

    } catch (error) {
      // Invalid token handling
      localStorage.removeItem("token");

      toast.error("Session expired. Please login again.");

      navigate("/login");
    }
  }, [navigate]);

  // Fetch Posts
  const fetchPosts = async () => {
    try {
      const res = await api.get("/api/posts");

      setPosts(res.data.data);

    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch posts";

      toast.error(message);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Create Post
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent empty post
    if (!content.trim()) {
      return toast.error("Post cannot be empty");
    }

    try {
      setLoading(true);

      // Create Post API
      const res = await api.post("/api/posts", {
        content,
      });

      // Add new post instantly at top
      setPosts((prevPosts) => [res.data.data, ...prevPosts]);

      // Clear textarea
      setContent("");

      // ✅ Success Toast
      toast.success("Post created successfully 🎉");

    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create post";

      // ❌ Error Toast
      toast.error(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">

      {/* Welcome Section */}
      <div className="mb-4">
        <h3 className="fw-bold">
          Welcome, {user?.email} 👋
        </h3>

        <p className="text-muted">
          Share your thoughts with the world.
        </p>
      </div>

      {/* Create Post Card */}
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
            <small className="text-muted">
              {content.length}/280 characters
            </small>

            <button
              type="submit"
              className="btn btn-dark px-4 rounded-pill"
              disabled={loading}
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </div>

      {/* Posts Feed */}
      <div>

        {posts.length === 0 ? (
          <div className="text-center text-muted mt-5">
            No posts available
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              className="card shadow-sm border-0 rounded-4 p-4 mb-4"
            >
              {/* User Info */}
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div>
                  <h6 className="fw-bold mb-0">
                    {post.userId?.email}
                  </h6>

                  <small className="text-muted">
                    {new Date(post.createdAt).toLocaleString()}
                  </small>
                </div>
              </div>

              {/* Post Content */}
              <p className="mb-0 fs-6">
                {post.content}
              </p>
            </div>
          ))
        )}

      </div>
    </div>
  );
}

export default Home;