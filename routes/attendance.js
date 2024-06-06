const express = require("express");
const attendanceController = require("../controllers/AttendanceController");
const authController = require("../controllers/AuthController");

const router = express.Router();

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("admin", "manager"),
    attendanceController.createAttendance
  )
  .get(
    authController.protect,
    authController.restrictTo("admin", "manager"),
    attendanceController.getAllAttendances
  );

router
  .route("/:userId")
  .get(
    authController.protect,
    authController.restrictTo("admin", "manager", "employee"),
    attendanceController.getAttendancesByUserId
  );

router
  .route("/record/:id")
  .get(
    authController.protect,
    authController.restrictTo("admin", "manager", "employee"),
    attendanceController.getAttendanceById
  )
  .put(
    authController.protect,
    authController.restrictTo("admin", "manager"),
    attendanceController.updateAttendance
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "manager"),
    attendanceController.deleteAttendance
  );

router.post(
  "/punch-in",
  authController.protect,
  authController.restrictTo("employee"),
  attendanceController.punchIn
);
router.post(
  "/punch-out",
  authController.protect,
  authController.restrictTo("employee"),
  attendanceController.punchOut
);

module.exports = router;
