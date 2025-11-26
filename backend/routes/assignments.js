const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const Inventory = require('../models/Inventory');
const Log = require('../models/Log');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

// GET /api/assignments
router.get('/', auth, role(['admin', 'logistics', 'commander']), async (req, res) => {
    try {
        const query = {};
        if (req.user.role !== 'admin') {
            query.baseId = req.user.baseId;
        }
        const assignments = await Assignment.find(query).sort({ date: -1 });
        res.json(assignments);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching assignments', error: err.message });
    }
});

// POST /api/assignments
router.post('/', auth, role(['admin', 'logistics']), async (req, res) => {
    const { assetType, assignedTo, type, quantity } = req.body;
    const baseId = req.user.baseId;

    // Logging input
    console.log("Incoming assignment request body:", req.body);

    // Validate quantity
    const parsedQuantity = Number(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
        return res.status(400).json({ message: " Invalid quantity" });
    }

    try {
        // Save assignment record
        const assignment = new Assignment({
            baseId,
            assetType,
            quantity: parsedQuantity,
            assignedTo,
            type,
        });

        await assignment.save();
        console.log("Assignment saved");

        //  Update inventory
        const inventory = await Inventory.findOne({ baseId, assetType });
        console.log("Fetched inventory:", inventory);

        if (!inventory || inventory.closingBalance < parsedQuantity) {
            return res.status(400).json({ message: " Not enough inventory" });
        }

        if (type === 'assigned') {
            inventory.assigned += parsedQuantity;
        } else if (type === 'expended') {
            inventory.expended += parsedQuantity;
        } else {
            return res.status(400).json({ message: " Invalid type. Must be 'assigned' or 'expended'" });
        }

        inventory.closingBalance -= parsedQuantity;
        await inventory.save();
        console.log("Inventory updated");

        // Step 3: Log action
        await Log.create({
            action: `ASSET_${type.toUpperCase()}`,
            userId: req.user.id,
            details: { baseId, assetType, quantity: parsedQuantity, assignedTo },
        });
        console.log("Action logged");

        res.status(201).json({ message: ` Asset ${type} successfully` });

    } catch (err) {
        console.error(" Assignment error:", err);
        res.status(500).json({ message: 'Assignment failed', error: err.message });
    }
});

module.exports = router;
