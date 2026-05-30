import { useEffect } from "react";

import api from "../api/axios";

import { toast } from "react-toastify";

import { usePosts } from "../context/PostContext";

function FeedList() {
  const { posts, setPosts, postsLoaded, setPostsLoaded } = usePosts();

  // Load posts only once
  useEffect(() => {
    if (postsLoaded) return;

    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get("/api/posts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPosts(res.data.data);

        setPostsLoaded(true);
      } catch (error) {
        console.error(error);

        toast.error("Failed to load posts");
      }
    };

    fetchPosts();
  }, [postsLoaded, setPosts, setPostsLoaded]);

  // ❤️ Like / Unlike Post
  const handleLikeToggle = async (post) => {
    try {
      const token = localStorage.getItem("token");

      // 💔 Unlike Post
      if (post.currentUserLiked) {
        await api.delete("/api/likes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },

          data: {
            targetId: post._id,
            targetType: "Post",
          },
        });

        // Update UI instantly
        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p._id === post._id
              ? {
                  ...p,
                  currentUserLiked: false,
                  likesCount: p.likesCount - 1,
                }
              : p,
          ),
        );
      } else {
        // ❤️ Like Post
        await api.post(
          "/api/likes",
          {
            targetId: post._id,
            targetType: "Post",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        // Update UI instantly
        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p._id === post._id
              ? {
                  ...p,
                  currentUserLiked: true,
                  likesCount: p.likesCount + 1,
                }
              : p,
          ),
        );
      }
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Failed to update like");
    }
  };

  // Empty Feed
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

          {/* Post Content */}
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
            {/* ❤️ Like Button */}
            <button
              onClick={() => handleLikeToggle(post)}
              className="btn border rounded-pill d-flex align-items-center px-3 py-2"
              style={{
                backgroundColor: post.currentUserLiked ? "#ffe5e5" : "#f8f9fa",

                borderColor: post.currentUserLiked ? "#ffb3b3" : "#dee2e6",

                transition: "0.2s",
              }}
            >
              {/* Heart Icon */}
              <span
                className="me-2"
                style={{
                  fontSize: "18px",

                  color: post.currentUserLiked ? "red" : "#6c757d",
                }}
              >
                ❤️
              </span>

              {/* Likes Count */}
              <span
                className="fw-semibold"
                style={{
                  color: post.currentUserLiked ? "red" : "#495057",
                }}
              >
                {post.likesCount}
              </span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FeedList;
