const express = require("express");
const router = express.Router();
const pool = require("../db");
const { verifyToken } = require("../middleware/middleware");

router.post("/:customerId/orders", verifyToken, async (req, res) => {
  const customerId = req.params.customerId;
  const { eateryId, foodItems } = req.body;

  if (foodItems.length === 0) {
    return res.status(404).json({ message: "No Food Item found in order" });
  }

  try {
    connection = await pool.getConnection(); 
    //begin transaction
    await connection.beginTransaction();
    const [insertResult] = await connection.execute(
      "INSERT INTO Orders (eatery_id, customer_id) VALUES (?, ?)",
      [eateryId, customerId]
    );

    for (const foodItemId of foodItems) {
      if (foodItemId != null) {
        await connection.execute(
          "INSERT IGNORE INTO OrderFoodItemMapping (order_id, food_item_id) VALUES (?, ?)",
          [insertResult.insertId, foodItemId]
        );
      }
    }
    await connection.commit();

    res.status(200).json({ message: "Order placed successfully" });
  } catch (error) {
    console.error("Error executing query", error);
    if (pool) {
        try {
          // Rollback the transaction in case of an error
          await pool.rollback();
        } catch (rollbackError) {
          console.error("Error rolling back transaction", rollbackError);
        }
      }
    res.status(500).json({ message: "Internal server error" });
  }finally {
    if (connection) {
      connection.release(); 
    }
  }

});

router.get("/:customerId/orders", verifyToken, async (req, res) => {
  const customerId = req.params.customerId;

  try {
    const rowCheckingQuery = "SELECT * FROM Orders WHERE customer_id = ?";

    const [orders] = await pool.execute(rowCheckingQuery, [customerId]);

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    } else {
      const [orders] = await pool.execute(
        "SELECT id, created_at, customer_id, eatery_id ,status FROM Orders WHERE customer_id = ?",
        [customerId]
      );

      for (const order of orders) {
        const [foodItems] = await pool.execute(
          `SELECT
          ofim.food_item_id,
          fi.name,
          fi.description,
          fi.price,
          fi.category_id
        FROM OrderFoodItemMapping ofim
        JOIN FoodItems fi ON ofim.food_item_id = fi.id
        WHERE ofim.order_id = ?`,
          [order.id]
        );
        order.foodItems = foodItems;
      }

      res.status(200).json({ orders: orders });
    }
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:customerId/orders/:orderId", verifyToken, async (req, res) => {
  const customerId = req.params.customerId;
  const orderId = req.params.orderId;

  try {
    const [order] = await pool.execute(
      "SELECT id, created_at, customer_id, eatery_id ,status FROM Orders WHERE id = ?",
      [orderId]
    );

    const orderDetils = order[0];

    const [foodItems] = await pool.execute(
      `SELECT
          ofim.food_item_id,
          fi.name,
          fi.description,
          fi.price,
          fi.category_id
        FROM OrderFoodItemMapping ofim
        JOIN FoodItems fi ON ofim.food_item_id = fi.id
        WHERE ofim.order_id = ?`,
      [orderDetils.id]
    );

    orderDetils.foodItems = foodItems;

    res.status(200).json({ order: orderDetils });
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
