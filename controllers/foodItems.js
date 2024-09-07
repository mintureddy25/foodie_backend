const express = require("express");
const router = express.Router();
const pool = require("../db");
const { verifyToken } = require("../middleware/middleware");


function isNotEmpty(value) {
  return value && value.trim() !== "";
}

function isValidPrice(value) {
  if (value === undefined || value === null || value.toString().trim() === "") {
    return false;
  }

  return (
    !isNaN(value) && typeof parseFloat(value) === "number" && isFinite(value)
  );
}

function isValidCategoryId(value) {
  return Number.isInteger(parseInt(value, 10));
}

router.post("/:eateryId/foodItems", verifyToken, async (req, res) => {
  const eateryId = req.params.eateryId;
  const { name, description, price, categoryId } = req.body;

  if (!isNotEmpty(name)) {
    res.status(400).json({ message: "Invalid Food item name" });
    return;
  }
  if (!isNotEmpty(description)) {
    res.status(400).json({ message: "Please enter description" });
    return;
  }

  if (!isValidPrice(price)) {
    res.status(400).json({ message: "Invalid price" });
    return;
  }

  if (!isValidCategoryId(categoryId)) {
    res.status(400).json({ message: "Invalid price" });
    return;
  }

  try {
    
    const [foodItemRows] = await pool.execute('SELECT * FROM FoodItems WHERE name = ? AND description = ? AND price = ? AND category_id = ? AND eatery_id = ?',
      [name, description, price, categoryId, eateryId]);

    if (foodItemRows.length > 0) {
      res.status(400).json({ message: 'Food Item already exists' });
      return;
    }
    const [insertResult] = await pool.execute('INSERT INTO FoodItems (name, description, price , category_id, eatery_id, status) VALUES (?, ?, ?, ?, ?, ?)', [name, description, price, categoryId, eateryId, 1]);
    
    res.status(200).json({ message: 'Food Item added successfully' });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put("/:eateryId/foodItems/:foodItemId", verifyToken, async (req, res) => {
    const eateryId = req.params.eateryId;
    const foodItemId = req.params.foodItemId;
    const { name, description, price, categoryId, available } = req.body;
    console.log("mintu price",price);
  
    if (!isNotEmpty(name)) {
      res.status(400).json({ message: "Invalid Food item name" });
      return;
    }
    if (!isNotEmpty(description)) {
      res.status(400).json({ message: "Please enter description" });
      return;
    }
  
    if (!isValidPrice(price)) {
      res.status(400).json({ message: "Invalid price" });
      return;
    }
  
    if (!isValidCategoryId(categoryId)) {
      res.status(400).json({ message: "Invalid price" });
      return;
    }
  
    try {

        const query = "Select * from FoodItems where id = ?";
        const [rows] = await pool.execute(query, [foodItemId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Food Item not found" });
        }
      
        const [result] = await pool.execute(
            `UPDATE FoodItems
             SET name = ?, description = ?, price = ?, category_id = ?, available = ?
             WHERE id = ?`,
            [name, description, price, categoryId, available, foodItemId]);
  
      res.status(200).json({ message: 'Food Item updated successfully' });
    } catch (error) {
      console.error('Error executing query', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.get('/foodItems/:foodItemId', verifyToken, async (req, res) => {
    
    const foodItemId = req.params.foodItemId;

    try {

        const foodItemQuery = "Select * from FoodItems where id = ?";
        const [foodItemRows] = await pool.execute(foodItemQuery, [foodItemId]);
        if (foodItemRows.length === 0) {
            return res.status(404).json({ message: "Food Item not found" });
        }
      
        const rowCheckingQuery =
            "SELECT * FROM FoodItems WHERE id = ?";
        const [FoodItemDetails] = await pool.execute(rowCheckingQuery, [foodItemId]);

        if (FoodItemDetails.length === 0) {
            return res.status(404).json({ message: "No Food Item found" });
        } else {
            return res
                .status(200)
                .json({ foodItem: FoodItemDetails[0] });
        }
        
    } catch (error) {
      console.error('Error executing query', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.get("/:eateryId/foodItems", verifyToken, async (req, res) => {

    const eateryId = req.params.eateryId;
    try {
      
      const [foodItemsRows] = await pool.execute('SELECT * FROM FoodItems WHERE status = 1 AND eatery_id = ?',[eateryId]);
      if (foodItemsRows.length === 0) {
        return res.status(404).json({ message: "No Food Items found" });
    } else {
        return res
            .status(200)
            .json({ foodItems: foodItemsRows });
    }
    
    } catch (error) {
      console.error('Error executing query', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.delete("/:eateryId/foodItems/:foodItemId", verifyToken, async (req, res) => {

    const eateryId = req.params.eateryId;
    const foodItemId = req.params.foodItemId;

    try {

        const foodItemQuery = "Select * from FoodItems where id = ?";
        const [foodItemRows] = await pool.execute(foodItemQuery, [foodItemId]);
        if (foodItemRows.length === 0) {
            return res.status(404).json({ message: "Food Item not found" });
        }
      
      const [updateResult] = await pool.execute(
        `UPDATE FoodItems SET status = '0' WHERE id = ?`,
        [foodItemId]);
      if (updateResult.length === 0) {
        return res.status(404).json({ message: "No Food Item found" });
    } else {
        return res.status(200).json({ message: 'Food Item deleted successfully' });
    }
    } catch (error) {
      console.error('Error executing query', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  module.exports = router;

  






