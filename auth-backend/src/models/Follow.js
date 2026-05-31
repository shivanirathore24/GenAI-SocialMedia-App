import mongoose from "mongoose";

const followSchema = new mongoose.Schema(
  {
    followerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Follower is required"],
      index: true,
    },

    followingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Following user is required"],
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// 🔥 Prevent duplicate follows
followSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

// 🔒 Prevent self-follow
followSchema.pre("save", function (next) {
  if (this.followerId.toString() === this.followingId.toString()) {
    return next(new Error("User cannot follow themselves"));
  }
  next();
});

// 🔒 Ensure user exists
followSchema.pre("save", async function (next) {
  try {
    const User = mongoose.model("User");

    const [follower, following] = await Promise.all([
      User.exists({ _id: this.followerId }),
      User.exists({ _id: this.followingId }),
    ]);

    if (!follower || !following) {
      return next(new Error("User does not exist"));
    }

    next();
  } catch (error) {
    next(error);
  }
});

const Follow = mongoose.model("Follow", followSchema);

export default Follow;
