const Transaction = require("../models/Transaction");

// Add a new transaction
const addTransaction = async (req, res) => {
  try {
    const { type, category, amount, description } = req.body;
    const transaction = new Transaction({
      type,
      category,
      amount,
      description,
      user: req.user._id, // Associate transaction with logged-in user
    });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all transactions (with pagination)
const getTransactions = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const transactions = await Transaction.find({ user: req.user._id })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    const count = await Transaction.countDocuments({ user: req.user._id });

    res
      .status(200)
      .json({ transactions, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get transaction by ID
const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id, // Ensure the transaction belongs to the logged-in user
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a transaction by ID
const updateTransaction = async (req, res) => {
  try {
    const { type, category, amount, description } = req.body;

    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id }, // Find by ID and ensure user matches
      { type, category, amount, description },
      { new: true } // Return the updated document
    );

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a transaction by ID
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id, // Ensure the transaction belongs to the logged-in user
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Report

const generateReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Validate date inputs
    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Start date and end date are required" });
    }

    // Convert start date to beginning of day in UTC
    const start = new Date(startDate);
    start.setUTCHours(0, 0, 0, 0);

    // Convert end date to end of day in UTC
    const end = new Date(endDate);
    end.setUTCHours(23, 59, 59, 999);

    // Validate date range
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    console.log("Start Date:", start.toISOString());
    console.log("End Date:", end.toISOString());
    console.log("User ID:", req.user._id);

    // Query transactions with proper date range
    const transactions = await Transaction.find({
      user: req.user._id,
      date: {
        $gte: start.toISOString(),
        $lte: end.toISOString(),
      },
    }).sort({ date: 1 });

    console.log("Transactions Found:", transactions.length);

    // Generate summary by category
    const summary = {
      totalExpenses: 0,
      byCategory: {},
      dateRange: {
        start: start.toISOString(),
        end: end.toISOString(),
      },
    };

    transactions.forEach((transaction) => {
      // Initialize category if it doesn't exist
      if (!summary.byCategory[transaction.category]) {
        summary.byCategory[transaction.category] = {
          total: 0,
          count: 0,
          transactions: [],
        };
      }

      // Update category statistics
      summary.byCategory[transaction.category].total += transaction.amount;
      summary.byCategory[transaction.category].count += 1;
      summary.byCategory[transaction.category].transactions.push({
        id: transaction._id,
        amount: transaction.amount,
        description: transaction.description,
        date: transaction.date,
      });

      // Update total expenses
      summary.totalExpenses += transaction.amount;
    });

    // Sort categories by total amount spent
    const sortedCategories = Object.entries(summary.byCategory)
      .sort(([, a], [, b]) => b.total - a.total)
      .reduce(
        (acc, [category, data]) => ({
          ...acc,
          [category]: data,
        }),
        {}
      );

    summary.byCategory = sortedCategories;

    res.status(200).json(summary);
  } catch (error) {
    console.error("Report Generation Error:", error);
    res.status(500).json({
      message: "Error generating report",
      error: error.message,
    });
  }
};

// Export the functions
module.exports = {
  addTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  generateReport,
};
