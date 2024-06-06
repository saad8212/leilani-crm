const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'] // Error message for required field
  },

  startDate: {
    type: Date,
    required: [true, 'Start date is required'], // Error message for required field
    validate: {
      validator: function(value) {
        return value <= this.endDate; // Start date must be before or equal to the end date
      },
      message: 'Start date must be before or equal to end date' // Error message for validation
    }
  },

  endDate: {
    type: Date,
    required: [true, 'End date is required'], // Error message for required field
    validate: {
      validator: function(value) {
        return value >= this.startDate; // End date must be after or equal to the start date
      },
      message: 'End date must be after or equal to start date' // Error message for validation
    }
  },

  reason: {
    type: String,
    required: [true, 'Reason for leave is required'] // Error message for required field
  },
  
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
});

const Leave = mongoose.model('Leave', leaveSchema);

module.exports = Leave;
