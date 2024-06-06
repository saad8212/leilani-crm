const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, index: true },
  punches: [
    {
      type: { type: String, enum: ["in", "out"], required: true },
      time: { type: Date, required: true },
    },
  ],
  breaks: { type: Number, default: 0, min: 0 },
  overtime: { type: Number, default: 0, min: 0 },
}, { timestamps: true });

attendanceSchema.methods.calculateTotalHours = function () {
  // Implement the logic to calculate total working hours
  return this.punches.reduce((total, punch, index, punches) => {
    if (punch.type === "in" && punches[index + 1] && punches[index + 1].type === "out") {
      return total + (punches[index + 1].time - punch.time) / (1000 * 60 * 60);
    }
    return total;
  }, 0);
};

attendanceSchema.statics.findByUserId = function (userId) {
  return this.find({ userId });
};

attendanceSchema.virtual('totalHours').get(function () {
  return this.calculateTotalHours();
});

attendanceSchema.set('toJSON', { virtuals: true });
attendanceSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
