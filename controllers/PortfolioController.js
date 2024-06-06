const Project = require("../models/Portfolio");
const cloudinary = require("../utils/cloudinary");
const mongoose = require("mongoose");
module.exports = {
  /*** Add Project to Database ***/
  input_project: async (req, res) => {
    const { name, url, category } = req.body;

    if (!req.file) {
      res.status(404).json({ message: "Project Image is Required!!" });
      return true;
    }
    let image_upload = await cloudinary.uploader.upload(req.file.path);
    console.log(image_upload);
    try {
      let data = {
        name,
        url,
        image: image_upload && image_upload.secure_url,
        image_id: image_upload && image_upload.public_id,
        category: mongoose.Types.ObjectId(category),
      };
      const project = await Project.create(data);
      res.status(200).json({
        status: "success",
        data: {
          project,
        },
      });
    } catch (err) {
      res.status(401).json({ status: "fail", message: err.message });
    }
  },

  /*** Get Projects from Database ***/
  get_project: async (req, res) => {
    try {
      // Filteration
      let queryObj = { ...req.query };
      let excludedFields = ["page", "limit", "sort", "fields"];
      excludedFields.forEach((field) => delete queryObj[field]);

      // Advance Filtering
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(
        /\b(gte|gt|lte|lt)\b/g,
        (match) => `$${match}`
      );
      console.log(JSON.parse(queryStr));

      let query = Project.find(JSON.parse(queryStr)).populate({
        path: "category",
        model: "Category",
        select: "name _id",
      });

      // Sorting
      if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        query = query.sort(sortBy);
      } else {
        query = query.sort("-createdAt");
      }

      //Fields Limiting

      if (req.query.fields) {
        const fields = req.query.fields.split(",").join(" ");
        query = query.select(fields);
      } else {
        query = query.select("-__v");
      }

      //Pagination
      const page = req.query.page * 1 || 1;
      const limit = req.query.limit * 1 || 10;
      const skip = (page - 1) * limit;

      query = query.skip(skip).limit(limit);

      if (req.query.page) {
        const data = await Project.countDocuments();
        if (skip >= data) throw new Error("This page does not exist");
      }
      // Execute the Query
      const projects = await query;

      res.status(200).json({
        status: "success",
        results: projects.length,
        data: {
          projects,
        },
      });
    } catch (err) {
      res.status(401).json({ status: "fail", message: err.message });
    }
  },

  /*** edit an existing Project ***/
  edit_project: async (req, res) => {
    try {
      let project = await Project.findById(req.params.id);
      res.status(200).json({
        status: "success",
        data: {
          project,
        },
      });
    } catch (err) {
      res.status(401).json({ status: "fail", message: err.message });
    }
  },

  update_project: async (req, res) => {
    try {
      const { name, url, category } = req.body;
      console.log(req.body);
      let image_upload;
      let record = await Project.findById(req.params.id);
      if (req.file) {
        console.log(record);
        await cloudinary.uploader.destroy(record.image_id);
        image_upload = await cloudinary.uploader.upload(req.file.path);
      }
      console.log(image_upload);
      let data = {
        name: name ? name: record.name,
        url: url ? url: record.url,
        category: category,
        image: image_upload ? image_upload.secure_url : record.image,
        image_id: image_upload ? image_upload.public_id: record.image_id,
      };
      const project = await Project.findByIdAndUpdate(req.params.id, data, {
        new: true,
      });
      res.status(200).json({
        status: "success",
        data: {
          project,
        },
      });
    } catch (err) {
      res.json({ status: "fail", message: err.message });
    }
  },

  /*** Remove a Project ***/
  remove_project: async (req, res) => {
    try {
      let result = await Project.findById(req.params.id);
      await Project.findByIdAndDelete(req.params.id);
      await cloudinary.uploader.destroy(result.image_id);
      res.status(204).json({ status: "success", data: null });
    } catch (err) {
      res.status(404).json({ status: "fail", message: err.message });
    }
  },
};
