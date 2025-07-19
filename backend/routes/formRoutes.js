const express = require("express");
const { 
  createForm, 
  getForm, 
  getAllForms,
  deleteForm
} = require("../controllers/formController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", auth, createForm);
router.get("/", auth, getAllForms);
router.get("/:id", getForm); // Add this line
router.delete("/:id", auth, deleteForm);

module.exports = router;