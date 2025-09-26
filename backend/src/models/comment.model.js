import { Schema, model } from "mongoose";

const commentSchema = new Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
    maxlength: 500,
  },
  parentComment: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
    default: null,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Comment = model("Comment", commentSchema);
export default Comment;
