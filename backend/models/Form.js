const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  type: { 
    type: String, 
    enum: ["text", "multiple-choice"], 
    default: "text" 
  },
  options: { 
    type: [String], 
    default: [],
    validate: {
      validator: function(options) {
        return this.type !== "multiple-choice" || options.length >= 2;
      },
      message: "Multiple choice questions must have at least 2 options"
    }
  },
  required: { type: Boolean, default: false }
}, {
  _id: true // ✅ Mongoose will auto-generate ObjectId (this is the default)
});

const formSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  questions: [questionSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  responses: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Response",
    default: [] // Ensure it's always an array
  }],
  responseCount: { type: Number, default: 0 }, // For quick counting
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update timestamp on save
formSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Form", formSchema);