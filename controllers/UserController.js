const User = require("../models/UsersSchema");
const cloudinary = require("../utils/cloudinary");

module.exports = {
  // Add User to Database
  addUser: async (req, res) => {
    try {
      const { email, password, name, role } = req.body;
      let image = null;
      let imageId = null;
      if(!name) {
        return res.status(400).json({
          status: "failed",
          message: "Please provide a name.",
        });
      }
      // Check if image file is uploaded
      if (req.file) {
        const imageUpload = await cloudinary.uploader.upload(req.file.path);
        image = imageUpload.secure_url;
        imageId = imageUpload.public_id;
      }

      const newUser = new User({ email, password, name, role, image, imageId });
      const user = await newUser.save();

      res.status(201).json({
        status: "success",
        data: { user }
      });
    } catch (err) {
      if (err.name === "MongoServerError" && err.code === 11000) {
        res.status(400).json({ status: "fail", message: "User already exists" });
      } else {
        res.status(400).json({ status: "fail", message: err.message });
      }
    }
  },

  // Get Users from Database
  getUsers: async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json({
        status: "success",
        results: users.length,
        data: { users }
      });
    } catch (err) {
      res.status(500).json({ status: "fail", message: err.message });
    }
  },

  // Get a Single User
  getSingleUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ status: "fail", message: "User not found" });
      }
      res.status(200).json({
        status: "success",
        data: { user }
      });
    } catch (err) {
      res.status(500).json({ status: "fail", message: err.message });
    }
  },

  // Update User
  updateUser: async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
      if (!user) {
        return res.status(404).json({ status: "fail", message: "User not found" });
      }
      res.status(200).json({
        status: "success",
        data: { user }
      });
    } catch (err) {
      res.status(400).json({ status: "fail", message: err.message });
    }
  },

  // Remove a User
  removeUser: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ status: "fail", message: "User not found" });
      }
      res.status(204).json({ status: "success", data: null });
    } catch (err) {
      res.status(500).json({ status: "fail", message: err.message });
    }
  }
};
