import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Target ID is required"],
      index: true,
    },

    targetType: {
      type: String,
      enum: {
        values: ["Post", "Comment"],
        message: "Invalid target type",
      },
      required: [true, "Target type is required"],
    },
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate likes
likeSchema.index(
  {
    userId: 1,
    targetId: 1,
    targetType: 1,
  },
  {
    unique: true,
  },
);

// Validate target existence
likeSchema.pre("save", async function () {
  const model = mongoose.model(this.targetType);

  const exists = await model.exists({
    _id: this.targetId,
  });

  if (!exists) {
    throw new Error(`${this.targetType} does not exist`);
  }
});

// ✅ Model Creation
const Like = mongoose.model("Like", likeSchema);

// ✅ Export
export default Like;
