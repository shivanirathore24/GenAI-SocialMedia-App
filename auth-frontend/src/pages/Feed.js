import PostForm from "../components/PostForm";

import FeedList from "../components/FeedList";

function Feed() {
  return (
    <div
      className="container py-4"
      style={{
        maxWidth: "700px",
      }}
    >
      {/* Feed Header */}
      <div className="mb-4 text-center">
        <h2 className="fw-bold display-6">Home Feed 📰</h2>

        <p className="text-muted">
          Share your thoughts and explore posts from others.
        </p>
      </div>

      {/* Create Post */}
      <PostForm />

      {/* Feed Posts */}
      <FeedList />
    </div>
  );
}

export default Feed;
