const mongoose = require("mongoose");
const Form = require("../models/Form");
exports.createForm = async (req, res) => {
  try {
    const { title, description, questions } = req.body;
    const form = new Form({ 
      title, 
      description,
      questions, 
      createdBy: req.userId 
    });
    await form.save();
    res.status(201).json(form);
  } catch (error) {
    console.error("Create form error:", error);
    res.status(500).json({ message: "Server error while creating form" });
  }
};

exports.getForm = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid form ID" });
    }
    
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: "Form not found" });
    res.json(form);
  } catch (error) {
    console.error("Get form error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllForms = async (req, res) => {
  try {
    const forms = await Form.find({ createdBy: req.userId });
    res.json(forms);
  } catch (error) {
    console.error("Get all forms error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteForm = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid form ID" });
    }
    
    const deletedForm = await Form.findByIdAndDelete(req.params.id);
    if (!deletedForm) return res.status(404).json({ message: "Form not found" });
    res.json({ message: "Form deleted successfully" });
  } catch (error) {
    console.error("Delete form error:", error);
    res.status(500).json({ message: "Server error" });
  }
};