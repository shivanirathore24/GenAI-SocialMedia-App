import { useEffect } from "react";

import api from "../api/axios";

import { toast } from "react-toastify";

import { usePosts } from "../context/PostContext";

function FeedList() {
  const { posts, setPosts } = usePosts();

  // Cache keys
  const CACHE_KEY = "socialmedia_posts_cache";

  const CACHE_TIME_KEY = "socialmedia_posts_cache_time";

  // 10 minutes
  const CACHE_DURATION = 10 * 60 * 1000;

  // Load Posts
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const now = Date.now();

        // Get cache
        const cachedPosts = localStorage.getItem(CACHE_KEY);

        const cachedTime = localStorage.getItem(CACHE_TIME_KEY);

        // Valid cache exists
        if (
          cachedPosts &&
          cachedTime &&
          now - Number(cachedTime) < CACHE_DURATION
        ) {
          console.log("Using cached posts");

          setPosts(JSON.parse(cachedPosts));

          return;
        }

        console.log("Fetching fresh posts");

        // Fetch fresh posts
        const token = localStorage.getItem("token");

        const res = await api.get("/api/posts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const fetchedPosts = res.data.data;

        // Update state
        setPosts(fetchedPosts);

        // Save cache
        localStorage.setItem(CACHE_KEY, JSON.stringify(fetchedPosts));

        localStorage.setItem(CACHE_TIME_KEY, now.toString());
      } catch (error) {
        console.error(error);

        toast.error("Failed to load posts");
      }
    };

    loadPosts();
  }, [setPosts]);

  // Update cache helper
  const updateCache = (updatedPosts) => {
    localStorage.setItem(CACHE_KEY, JSON.stringify(updatedPosts));

    localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
  };

  // ❤️ Like / Unlike
  const handleLikeToggle = async (post) => {
    try {
      const token = localStorage.getItem("token");

      let updatedPost = null;

      // 💔 Unlike
      if (post.currentUserLiked) {
        const res = await api.delete("/api/likes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },

          data: {
            targetId: post._id,

            targetType: "Post",
          },
        });

        updatedPost = {
          ...res.data.data,

          currentUserLiked: false,
        };
      } else {
        // ❤️ Like
        const res = await api.post(
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

        updatedPost = {
          ...res.data.data,

          currentUserLiked: true,
        };
      }

      // Update state
      const updatedPosts = posts.map((p) =>
        p._id === post._id ? updatedPost : p,
      );

      setPosts(updatedPosts);

      // Update cache
      updateCache(updatedPosts);
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Failed to update like");
    }
  };

  // Empty feed
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
              {/* Heart */}
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
