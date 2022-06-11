const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Reply = new Schema({
  content: { type: String, required: true },
  author: {
    userId: { type: Schema.Types.ObjectId, required: true },
    fullname: { type: String, required: true },
  },
  courseId: { type: Schema.Types.ObjectId, ref: "course", required: true },
  topicId: { type: Schema.Types.ObjectId, ref: "topic", required: true },
  channelId: { type: Schema.Types.ObjectId, ref: "channel", required: true },
  materialId: { type: Schema.Types.ObjectId, ref: "material", required: true },
  likes: [{ type: Schema.Types.ObjectId, default: [] }],
  dislikes: [{ type: Schema.Types.ObjectId, default: [] }],
  createdAt: { type: Date },
  updatedAt: { type: Date },
});

module.exports = mongoose.model("reply", Reply);
