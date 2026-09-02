const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// Save a new measurement entry
router.post('/', auth, async (req, res) => {
  try {
    const { weight, height, bmi } = req.body;
    const userId = req.user.id;

    const newMeasurement = await pool.query(
      'INSERT INTO measurements (user_id, weight, height, bmi) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, weight, height, bmi]
    );

    res.status(201).json(newMeasurement.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error saving measurement.' });
  }
});

// Get month-over-month comparison
router.get('/compare', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch the latest 2 records ordered by date or creation time descending
    const result = await pool.query(
      'SELECT * FROM measurements WHERE user_id = $1 ORDER BY recorded_date DESC, created_at DESC LIMIT 2',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No measurement records found.' });
    }

    const current = result.rows[0];
    const previous = result.rows.length > 1 ? result.rows[1] : null;

    let difference = null;
    if (previous) {
      difference = (parseFloat(current.weight) - parseFloat(previous.weight)).toFixed(1);
    }

    res.json({
      current,
      previous,
      difference: difference !== null ? parseFloat(difference) : null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching comparison data.' });
  }
});

module.exports = router;