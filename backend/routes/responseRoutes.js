const express = require("express");
const {
  submitResponse,
  getSummary,
  getFormResponses,
  downloadCSV,
} = require("../controllers/responseController");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

// Public route (no auth needed)
router.post("/", submitResponse);

// Protected routes
router.get("/summary/:formId", getSummary);
router.get("/export/:formId", downloadCSV);
router.get("/form/:formId", auth, getFormResponses);

module.exports = router;