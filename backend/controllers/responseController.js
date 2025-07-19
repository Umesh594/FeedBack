const mongoose = require("mongoose");
const { Parser } = require('json2csv');
const Response = require("../models/Response");
const Form = require("../models/Form");

exports.submitResponse = async (req, res) => {
  try {
    const { formId, answers } = req.body;

    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ success: false, message: "Form not found" });
    }

    // Structure answers
    const structuredAnswers = {};
    form.questions.forEach(q => {
      structuredAnswers[q._id.toString()] = answers[q._id.toString()] || "";
    });

    const response = new Response({
      form: formId,
      answers: structuredAnswers,
      submittedAt: new Date(),
    });

    await response.save();

    // Update form metadata
    form.responses.push(response._id);
    form.responseCount = form.responses.length;
    await form.save();

    // ✅ Keep extracting email (still needed for .csv etc.), but skip sending
    const emailQuestion = form.questions.find(q => q.isEmailField);
    const userEmail = emailQuestion ? structuredAnswers[emailQuestion._id.toString()] : null;

    // ❌ Removed resend.emails.send() block here

    return res.status(201).json({
      success: true,
      message: "Response submitted!",
      responseId: response._id
    });

  } catch (error) {
    console.error("SUBMIT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error submitting response",
      error: error.message
    });
  }
};



exports.getFormResponses = async (req, res) => {
  try {
    const formId = req.params.formId;

    if (!mongoose.Types.ObjectId.isValid(formId)) {
      return res.status(400).json({ message: "Invalid form ID" });
    }

    const form = await Form.findById(formId);
    if (!form) return res.status(404).json({ message: "Form not found" });

    // ✅ Fetch responses directly
    const responses = await Response.find({ form: formId });

    res.json(responses);
  } catch (error) {
    console.error("Get form responses error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getSummary = async (req, res) => {
  const { formId } = req.params;

  const responses = await Response.find({ form: formId });
  const form = await Form.findById(formId);

  const summary = form.questions.map((q) => ({
    question: q.question,
    type: q.type,
    summary:
      q.type === "multiple-choice"
        ? q.options.map((opt) => ({
            option: opt,
            count: responses.filter(
              (r) => r.answers[q._id.toString()] === opt
            ).length,
          }))
        : null,
  }));

  res.json({ summary });
};


exports.downloadCSV = async (req, res) => {
  const { formId } = req.params;

  const form = await Form.findById(formId);
  const responses = await Response.find({ form: formId });

  const questionMap = {};
  form.questions.forEach((q) => {
    questionMap[q._id.toString()] = q.question;
  });

  const data = responses.map((r) => {
  const row = {
    submittedAt: r.submittedAt,
  };

  // Ensure same question order as form.questions
  form.questions.forEach((q) => {
    const questionText = q.question;
    const answer = r.answers?.[q._id] || '';
    row[questionText] = answer;
  });

  return row;
});

  const parser = new Parser();
  const csv = parser.parse(data);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=responses.csv");
  res.send(csv);
};