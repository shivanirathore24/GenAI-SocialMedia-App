// src/utils/seeder.js

import mongoose from "mongoose";

import bcrypt from "bcryptjs";

import dotenv from "dotenv";

import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import Like from "../models/Like.js";
import Follow from "../models/Follow.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect MongoDB
    await mongoose.connect(process.env.MONGO_URI_PROD);

    console.log("MongoDB Connected");

    // Clear old data
    await User.deleteMany();

    await Post.deleteMany();

    await Comment.deleteMany();

    await Like.deleteMany();

    await Follow.deleteMany();

    console.log("Old data cleared");

    // Hash password
    const hashedPassword = await bcrypt.hash("123456", 10);

    // Create Users
    // Create Users
    const users = await User.insertMany([
      {
        username: "ranveersingh",
        email: "ranveersingh@gmail.com",
        password: hashedPassword,
      },

      {
        username: "shivanirathore",
        email: "shivanirathore@gmail.com",
        password: hashedPassword,
      },

      {
        username: "shubmangill",
        email: "shubmangill@gmail.com",
        password: hashedPassword,
      },
    ]);

    console.log("Users seeded");

    // Create Posts
    const posts = await Post.insertMany([
      {
        userId: users[2]._id,
        content: "That last over finish was unbelievable 🏏🔥",
      },

      {
        userId: users[0]._id,
        content: "Just watched an amazing movie tonight 🎬❤️",
      },

      {
        userId: users[1]._id,
        content: "Serving the nation with honesty and discipline 🇮🇳✨",
      },

      {
        userId: users[2]._id,
        content: "IPL season is getting more exciting every match 😍🏏",
      },

      {
        userId: users[0]._id,
        content: "Bollywood movies and late night coffee ☕🎥",
      },
    ]);

    console.log("Posts seeded");

    // Create Comments
    const comments = await Comment.insertMany([
      {
        userId: users[0]._id,
        postId: posts[0]._id,
        content: "What a thrilling match 🔥",
      },

      {
        userId: users[1]._id,
        postId: posts[0]._id,
        content: "That shot over covers was pure class 🏏",
      },

      {
        userId: users[2]._id,
        postId: posts[1]._id,
        content: "Which movie did you watch? 😄",
      },

      {
        userId: users[0]._id,
        postId: posts[2]._id,
        content: "Proud of people serving the country 🇮🇳",
      },

      {
        userId: users[1]._id,
        postId: posts[4]._id,
        content: "Coffee and movies are the best combo ☕❤️",
      },
    ]);

    console.log("Comments seeded");

    // Nested Comment
    await Comment.create({
      userId: users[2]._id,
      postId: posts[0]._id,
      parentCommentId: comments[0]._id,

      content: "Absolutely loved the match 🏏🔥",
    });

    console.log("Nested comments seeded");

    // Create Likes
    await Like.insertMany([
      {
        userId: users[0]._id,
        targetId: posts[0]._id,
        targetType: "Post",
      },

      {
        userId: users[1]._id,
        targetId: posts[0]._id,
        targetType: "Post",
      },

      {
        userId: users[2]._id,
        targetId: posts[1]._id,
        targetType: "Post",
      },

      {
        userId: users[0]._id,
        targetId: comments[1]._id,
        targetType: "Comment",
      },
    ]);

    // Update likes count
    await Post.findByIdAndUpdate(posts[0]._id, {
      likesCount: 2,
    });

    await Post.findByIdAndUpdate(posts[1]._id, {
      likesCount: 1,
    });

    console.log("Likes seeded");

    // Create Follow relations
    await Follow.insertMany([
      {
        followerId: users[0]._id,
        followingId: users[1]._id,
      },

      {
        followerId: users[1]._id,
        followingId: users[2]._id,
      },

      {
        followerId: users[2]._id,
        followingId: users[0]._id,
      },
    ]);

    console.log("Follows seeded");
    console.log("Database seeded successfully ✅");

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDatabase();
