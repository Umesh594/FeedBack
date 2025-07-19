const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

exports.register = async (req, res) => {
  const { name, email, password, adminCode } = req.body;

if (adminCode !== process.env.ADMIN_SECRET) {
  return res.status(400).json({ message: 'Invalid admin code' });
}

const exists = await Admin.findOne({ email });
if (exists) return res.status(400).json({ message: "Email already registered" });

const admin = new Admin({ name, email, password }); // ✅ Add name
await admin.save();

const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
res.json({ token });

};





exports.login = async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin || !(await admin.comparePassword(password)))
    return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
  res.json({ token });
};
