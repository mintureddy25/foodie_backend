const express = require("express");
const router = express.Router();
const pool = require("../db");
const { verifyToken } = require("../middleware/middleware");


router.get('/:eateryId/orders', verifyToken, async (req,res) => {

    const eateryId = req.params.eateryId;

    try {
   
        const rowCheckingQuery =
            "SELECT * FROM Orders WHERE eatery_id = ?";
        const [ordersDetils] = await pool.execute(rowCheckingQuery, [eateryId]);

        if (ordersDetils.length === 0) {
            return res.status(404).json({ message: "No Order found" });
        } else {
            return res
                .status(200)
                .json({ Orders: ordersDetils});
        }
        
    } catch (error) {
      console.error('Error executing query', error);
      res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/:eateryId/orders/:orderId', verifyToken, async (req,res) => {

    const eateryId = req.params.eateryId;
    const orderId = req.params.orderId;

    try {
   
        const rowCheckingQuery =
            "SELECT * FROM Orders WHERE id = ?";
        const [orderDetils] = await pool.execute(rowCheckingQuery, [orderId]);

        if (orderDetils.length === 0) {
            return res.status(404).json({ message: "Order not found" });
        } else {
            return res
                .status(200)
                .json({ Orders: orderDetils[0]});
        }
        
    } catch (error) {
      console.error('Error executing query', error);
      res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
