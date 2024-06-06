const express = require("express");
const upload = require("../middleware/MulterMiddleware");
const router = express.Router();

// Import Controllers
const UserController = require("../controllers/UserController");
const SalaryController = require("../controllers/SalaryController");
const SalesController = require("../controllers/SalesController");
const AuthController = require("../controllers/AuthController");

// Homepage Route
router.get("/", (req, res) => {
  res.send("Welcome to Leilani Employee Management System");
});

// Authentication Routes
router.post("/auth/login", AuthController.login);

// Salary Routes
router
  .route("/api/salary")
  .get(SalaryController.getSalaries)
  .post(SalaryController.addSalary);

router
  .route("/api/salary/:id")
  .get(SalaryController.getSingleSalary)
  .patch(SalaryController.updateSalary)
  .delete(SalaryController.deleteSalary);

// Sales Routes
router
  .route("/api/sales")
  .get(SalesController.getSales)
  .post(SalesController.addSales);

router
  .route("/api/sales/:id")
  .get(SalesController.getSingleSale)
  .patch(SalesController.updateSale)
  .delete(SalesController.deleteSale);

// Users Routes
router
  .route("/api/users")
  .get(
    AuthController.protect,
    AuthController.restrictTo("admin", "manager"),
    UserController.getUsers
  )
  .post(
    upload.single("image"),
    AuthController.protect,
    AuthController.restrictTo("admin", "manager"),
    UserController.addUser
  );

router
  .route("/api/users/:id")
  .get(
    AuthController.protect,
    AuthController.restrictTo("admin", "manager"),
    UserController.getSingleUser
  )
  .patch(
    upload.single("image"),
    AuthController.protect,
    AuthController.restrictTo("admin", "manager"),
    UserController.updateUser
  )
  .delete(
    AuthController.protect,
    AuthController.restrictTo("admin", "manager"),
    UserController.removeUser
  );

// Route Not Found
router.all("*", (req, res) => {
  res.send("Route not found");
});

module.exports = router;
