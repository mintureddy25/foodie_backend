const express = require('express');
const router = express.Router();
const pool = require('../../db');
const { generateToken } = require('../token');


function validatePassword(password) {
  // Password validation logic goes here
  if(!password || password?.length <1) return false
  return true;
}

function validateEmail(email) {
  // Email validation logic goes here
  if(!email || email?.length<5) return false
  return true;
}

router.post('/login', async (req,res) => {
    const {email, password } = req.body;
  if (!validateEmail(email)) {
    res.status(422).json({ message: 'Invalid email' });
    return;
  }

  if (!validatePassword(password)) {
    res.status(422).json({ message: 'Invalid password' });
    return;
  }
  try {
    // Select the user from the database based on their email
    const [rows] = await pool.execute('SELECT * FROM Eateries WHERE email = ?', [email]);

    if (rows.length === 1) {
      const eatery = rows[0];
      // Verify the password
      if (password === eatery.password) {
        // Generate a JWT token with the user ID and email
        const token = generateToken({ id: eatery.id, email: eatery.email });
        res.json({ 
          "id" : eatery.id,
          "name":eatery.name,
          "email":eatery.email,
          token });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      res.status(404).json({ message: 'Invalid Eatery' });
    }
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ message: 'Internal server error' });
  }
})


module.exports = router;