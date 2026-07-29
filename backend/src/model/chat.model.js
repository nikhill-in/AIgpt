import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    title: { type: String, default: "New Chat" },
  },
  { timestamps: true },
);

export default mongoose.model("Chat", chatSchema);
