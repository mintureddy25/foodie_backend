const express = require("express");
const router = express.Router();
const pool = require("../db");
const { verifyToken } = require("../middleware/middleware");

router.get("/:customerId/eateries", verifyToken, async (req, res) => {
  const customerId = req.params.customerId;

  try {
    const rowCheckingQuery = "SELECT * FROM Eateries WHERE status = 'active' AND open = '1'";

    const [eateriesDetails] = await pool.execute(rowCheckingQuery);

    if (eateriesDetails.length === 0) {
      return res.status(404).json({ message: "No eateries are open" });
    } else {
      return res.status(200).json({ eateries: eateriesDetails });
    }
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.get("/:customerId/eateries/:eateryId", verifyToken, async (req, res) => {
    const customerId = req.params.customerId;
    const eateryId = req.params.eateryId;
  
    try {
      const rowCheckingQuery = "SELECT * FROM Eateries WHERE id = ?";
  
      const [eateryDetails] = await pool.execute(rowCheckingQuery, [eateryId]);
  
      if (eateryDetails.length === 0) {
        return res.status(404).json({ message: "No eaterie found" });
      } else {
        return res.status(200).json({ eatery: eateryDetails[0] });
      }
    } catch (error) {
      console.error("Error executing query", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  router.get("/:customerId/eateries/:eateryId/foodItems", verifyToken, async (req, res) => {
    const customerId = req.params.customerId;
    const eateryId = req.params.eateryId;
  
    try {
      const rowCheckingQuery = "SELECT * FROM FoodItems WHERE eatery_id = ? AND status = '1'";
  
      const [FoodItems] = await pool.execute(rowCheckingQuery, [eateryId]);
  
      if (FoodItems.length === 0) {
        return res.status(404).json({ message: "No Food Items found" });
      } else {
        return res.status(200).json({ restaurantFoodItems: FoodItems });
      }
    } catch (error) {
      console.error("Error executing query", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  router.get("/:customerId/eateries/:eateryId/foodItems/:foodItemId", verifyToken, async (req, res) => {
    const customerId = req.params.customerId;
    const eateryId = req.params.eateryId;
    const foodItemId = req.params.foodItemId;
  
    try {
        const rowCheckingQuery = "SELECT * FROM FoodItems WHERE eatery_id = ? AND id = ? AND status = '1'";

        // Execute the query using your database pool
        const [foodItem] = await pool.execute(rowCheckingQuery, [eateryId,foodItemId]);
  
      if (foodItem.length === 0) {
        return res.status(404).json({ message: "No Food Item found" });
      } else {
        return res.status(200).json({ foodItem: foodItem[0] });
      }
    } catch (error) {
      console.error("Error executing query", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });



module.exports = router;
