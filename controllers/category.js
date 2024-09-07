const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/foodCategories", async (req, res) => {
  
  try {
    const rowCheckingQuery = "SELECT * FROM FoodCategories";

    const [foodCategories] = await pool.execute(rowCheckingQuery);

    if (foodCategories.length === 0) {
      return res.status(404).json({ message: "No Food categories are found" });
    } else {
      return res.status(200).json({ foodCategories: foodCategories });
    }
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;