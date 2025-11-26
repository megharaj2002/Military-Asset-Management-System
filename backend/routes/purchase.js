const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase');
const Inventory = require('../models/Inventory');
const Log = require('../models/Log');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

// GET /api/purchases
router.get('/', auth, role(['admin', 'logistics', 'commander']), async (req, res) => {
    try {
        const query = {};
        if (req.user.role !== 'admin') {
            query.baseId = req.user.baseId;
        }
        const purchases = await Purchase.find(query).sort({ date: -1 });
        res.json(purchases);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching purchases', error: err.message });
    }
});

router.post('/', auth, role(['admin', 'logistics']), async (req, res) => {
    const { assetType, quantity } = req.body;
    const baseId = req.user.baseId;

    try {
        //  Save the purchase record
        const purchase = new Purchase({ baseId, assetType, quantity });
        await purchase.save();

        //  Update inventory for this base & asset
        const inventory = await Inventory.findOne({ baseId, assetType });

        if (inventory) {
            inventory.purchases += quantity;
            inventory.closingBalance += quantity;
            await inventory.save();
        } else {
            await Inventory.create({
                baseId,
                assetType, //  not assetId
                purchases: quantity,
                closingBalance: quantity
            });
        }

        // Log the purchase
        await Log.create({
            action: 'PURCHASE_CREATED',
            userId: req.user.id,
            details: { baseId, assetType, quantity }
        });

        res.status(201).json({ message: 'Purchase recorded successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Purchase failed', error: err.message });
    }
});

module.exports = router;
