const Attendance = require("../models/AttendanceSchema");
const mongoose = require("mongoose");

// Create a new attendance record
exports.createAttendance = async (req, res) => {
  try {
    const { userId, date, punches, breaks, overtime } = req.body;
    const attendance = new Attendance({
      userId,
      date,
      punches,
      breaks,
      overtime,
    });
    await attendance.save();
    res.status(201).json({
      status: "success",
      data: { attendance },
    });
    res.status(201).json({ status: "success", data: { attendance } });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all attendance records
exports.getAllAttendances = async (req, res) => {
  try {
    const attendance = await Attendance.find().populate("userId", "name email");
    res.status(200).json({
      status: "success",
      results: attendance.length,
      data: { attendance },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get attendance records by user ID
exports.getAttendancesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const attendances = await Attendance.find({ userId }).populate(
      "userId",
      "name email"
    );
    if (attendances.length === 0) {
      return res
        .status(404)
        .json({ message: "No attendance records found for this user" });
    }
    res.json(attendances);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single attendance record by ID
exports.getAttendanceById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid attendance ID" });
    }
    const attendance = await Attendance.findById(id).populate(
      "userId",
      "name email"
    );
    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update an attendance record by ID
exports.updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid attendance ID" });
    }
    const { userId, date, punches, breaks, overtime } = req.body;
    const attendance = await Attendance.findByIdAndUpdate(
      id,
      { userId, date, punches, breaks, overtime },
      { new: true, runValidators: true }
    );
    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }
    res.json(attendance);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete an attendance record by ID
exports.deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid attendance ID" });
    }
    const attendance = await Attendance.findByIdAndDelete(id);
    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }
    res.json({ message: "Attendance record deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Punch in
exports.punchIn = async (req, res) => {
  try {
    const userId = req.user._id;
    const date = new Date().toISOString().split("T")[0];
    console.log(Attendance)
    
    let attendance = await Attendance.findOne({ userId, date });

    if (!attendance) {
      attendance = new Attendance({
        userId,
        date,
        punches: [{ type: "in", time: new Date() }],
      });
    } else {
      attendance.punches.push({ type: "in", time: new Date() });
    }

    await attendance.save();
    res.status(200).json({ status: "success", data: attendance });
  } catch (err) {
    res.status(400).json({ status: "failed", message: err.message });
  }
};

// Punch out
exports.punchOut = async (req, res) => {
  try {
    const userId = req.user._id;
    const date = new Date().toISOString().split("T")[0];

    let attendance = await Attendance.findOne({ userId, date });
    if (!attendance) {
      return res
        .status(404)
        .json({ message: "No attendance record found for today." });
    }

    attendance.punches.push({ type: "out", time: new Date() });
    await attendance.save();
    res.status(200).json({ status: "success", data: attendance });
  } catch (err) {
    res.status(400).json({ status: "failed", message: err.message });
  }
};
