const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  basicSalary: {
    type: Number,
    required: true
  },
  deductions: {
    type: Number,
    default: 0
  },
  leaveDeductionRate: {
    type: Number,
    default: 0.02 // Default leave deduction rate (2% of basic salary)
  },
  monthlyAggregatedSalary: {
    type: Number,
    default: 0
  },
  commission: {
    type: Number,
    default: 0
  }
});

salarySchema.methods.calculateCommission = async function() {
  const Sales = mongoose.model('Sales');
  const sales = await Sales.find({ employeeId: this.employeeId, date: { $gte: new Date(new Date().setHours(0,0,0,0)) } });
  const departmentCommissionRates = {
    'department1': 0.05, // Example commission rate for department 1 (5%)
    'department2': 0.07, // Example commission rate for department 2 (7%)
    'department3': 0.1   // Example commission rate for department 3 (10%)
    // Add more department commission rates as needed
  };
  const totalSales = sales.reduce((total, sale) => total + sale.amount, 0);
  const employeeDepartment = this.employee.department;
  const commissionRate = departmentCommissionRates[employeeDepartment] || 0;
  const commission = totalSales * commissionRate;
  this.commission = commission;
  return commission;
};

const Salary = mongoose.model('Salary', salarySchema);

module.exports = Salary;
