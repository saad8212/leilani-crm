const Sales = require("../models/SalesSchema");

module.exports = {
  /*** Create Sales ***/
  addSales: async (req, res) => {
    try {
      const { employeeId, amount, department } = req.body;
      const newSales = new Sales({ employeeId, amount, department });
      const sales = await newSales.save();
      res.status(200).json({ status: "success", data: sales });
    } catch (err) {
      res.status(400).json({ status: "fail", message: err.message });
    }
  },

  /*** Read All Sales ***/
  getSales: async (req, res) => {
    try {
      const sales = await Sales.find();
      res.status(200).json({ status: "success", data: sales });
    } catch (err) {
      res.status(401).json({ status: "fail", message: err.message });
    }
  },

  /*** Read Single Sale ***/
  getSingleSale: async (req, res) => {
    try {
      const sale = await Sales.findById(req.params.id);
      res.status(200).json({ status: "success", data: sale });
    } catch (err) {
      res.status(404).json({ status: "fail", message: err.message });
    }
  },

  /*** Update Sale ***/
  updateSale: async (req, res) => {
    try {
      const sale = await Sales.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      res.status(200).json({ status: "success", data: sale });
    } catch (err) {
      res.status(400).json({ status: "fail", message: err.message });
    }
  },

  /*** Delete Sale ***/
  deleteSale: async (req, res) => {
    try {
      await Sales.findByIdAndDelete(req.params.id);
      res.status(204).json({ status: "success", data: null });
    } catch (err) {
      res.status(404).json({ status: "fail", message: err.message });
    }
  },
};
