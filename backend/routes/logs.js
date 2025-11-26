const express = require('express');
const router = express.Router();
const Log = require('../models/Log');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

// GET /api/logs
router.get('/', auth, role(['admin']), async (req, res) => {
    try {
        const logs = await Log.find().populate('userId', 'name role').sort({ timestamp: -1 });
        res.json(logs);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching logs' });
    }
});

module.exports = router;
