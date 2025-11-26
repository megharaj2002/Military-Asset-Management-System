const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

// GET /api/dashboard
router.get('/', auth, role(['admin', 'commander', 'logistics']), async (req, res) => {
    const baseId = req.user.baseId; // user's assigned base
    const { startDate, endDate, assetType } = req.query;

    try {
        // Build query for Inventory (Current State)
        // Inventory is always current state, filters apply to "Net Movement" breakdown if we were to return it.
        // For now, we return the current inventory state as the main dashboard.
        // If filters are present, we might want to return aggregated transaction data instead.

        let query = { baseId };
        if (assetType) {
            query.assetType = assetType;
        }

        const data = await Inventory.find(query);

        const dashboard = data.map(item => ({
            assetType: item.assetType,
            openingBalance: item.openingBalance, // This is static in current model
            purchases: item.purchases,
            transferIn: item.transferIn,
            transferOut: item.transferOut,
            assigned: item.assigned,
            expended: item.expended,
            closingBalance: item.closingBalance,
            netMovement: item.purchases + item.transferIn - item.transferOut
        }));

        res.json({ dashboard });
    } catch (err) {
        res.status(500).json({ message: "Dashboard error", error: err.message });
    }
});

module.exports = router;
