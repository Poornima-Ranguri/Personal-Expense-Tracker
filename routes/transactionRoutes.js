const express = require("express");
const {
  addTransaction,
  getTransactions,
  generateReport,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/transactions", protect, addTransaction);
router.get("/transactions", protect, getTransactions);
router.get("/transactions/:id", protect, getTransactionById);
router.put("/transactions/:id", protect, updateTransaction);
router.delete("/transactions/:id", protect, deleteTransaction);

router.get("/report", protect, generateReport);

module.exports = router;
