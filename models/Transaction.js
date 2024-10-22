const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  type: { type: String, enum: ["income", "expense"], required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  description: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

// Use mongoose.models.Transaction if it exists, or create the model if not
module.exports =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);
