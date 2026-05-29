import { useEffect } from "react";

import api from "../api/axios";

import { toast } from "react-toastify";

import { usePosts } from "../context/PostContext";

function FeedList() {
  const { posts, setPosts, postsLoaded, setPostsLoaded } = usePosts();

  // 🔥 Download only first time
  useEffect(() => {
    if (postsLoaded) return;

    const fetchPosts = async () => {
      try {
        const res = await api.get("/api/posts");

        setPosts(res.data.data);

        // Prevent re-downloading
        setPostsLoaded(true);
      } catch (error) {
        toast.error("Failed to load posts");
      }
    };

    fetchPosts();
  }, [postsLoaded, setPosts, setPostsLoaded]);

  if (posts.length === 0) {
    return (
      <div className="text-center text-muted mt-5">No posts available</div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <div
          key={post._id}
          className="card shadow-sm border-0 rounded-4 p-4 mb-4"
        >
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center">
              {/* Avatar */}
              <div
                className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                style={{
                  width: "45px",
                  height: "45px",
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
              >
                {post.userId?.email?.charAt(0).toUpperCase()}
              </div>

              {/* User Info */}
              <div>
                <h6 className="mb-0 fw-bold">{post.userId?.email}</h6>

                <small className="text-muted">
                  {new Date(post.createdAt).toLocaleString()}
                </small>
              </div>
            </div>
          </div>

          {/* Content */}
          <p
            className="mb-4 fs-6"
            style={{
              whiteSpace: "pre-wrap",
              lineHeight: "1.7",
            }}
          >
            {post.content}
          </p>

          {/* Footer */}
          <div className="d-flex justify-content-end align-items-center">
            {/* Like Button */}
            <button
              className="btn btn-light border rounded-pill d-flex align-items-center px-3 py-2"
              style={{
                transition: "0.2s",
              }}
            >
              {/* Heart Icon */}
              <span
                className="me-2"
                style={{
                  fontSize: "18px",
                }}
              >
                ❤️
              </span>

              {/* Like Count */}
              <span className="fw-semibold">{post.likesCount}</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FeedList;
