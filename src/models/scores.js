const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const scoreSchema = new Schema({
  score: {
    type: Number,
    required: true,
    default: 0,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  remark: {
    type: String,
  },
});

module.exports = mongoose.model("Score", scoreSchema);
