const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

// GET /api/dashboard
// GET /api/dashboard
router.get('/', auth, role(['admin', 'commander', 'logistics']), async (req, res) => {
    const baseId = req.user.baseId;
    const { startDate, endDate, assetType } = req.query;

    try {
        // 1. Fetch Current Inventory State (The Anchor)
        let inventoryQuery = { baseId };
        if (assetType) inventoryQuery.assetType = assetType;
        const currentInventory = await Inventory.find(inventoryQuery);

        // If no dates provided, return current state as is (fast path)
        if (!startDate || !endDate) {
            const dashboard = currentInventory.map(item => ({
                assetType: item.assetType,
                openingBalance: item.openingBalance, // This might be static "original" opening, but acceptable for default view
                purchases: item.purchases,
                transferIn: item.transferIn,
                transferOut: item.transferOut,
                assigned: item.assigned,
                expended: item.expended,
                closingBalance: item.closingBalance,
                netMovement: item.purchases + item.transferIn - item.transferOut - item.assigned - item.expended
            }));
            return res.json({ dashboard });
        }

        // 2. Dynamic Calculation for Date Range
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Include the full end day

        // Helper to build transaction query
        const buildTxQuery = (baseField) => {
            const q = { [baseField]: baseId, date: { $gte: start } }; // Get everything from start date onwards
            if (assetType) q.assetType = assetType;
            return q;
        };

        // Fetch all relevant transactions from StartDate to NOW
        const [purchases, transfersIn, transfersOut, assignments] = await Promise.all([
            require('../models/Purchase').find(buildTxQuery('baseId')),
            require('../models/Transfer').find(buildTxQuery('toBaseId')),
            require('../models/Transfer').find(buildTxQuery('fromBaseId')),
            require('../models/Assignment').find(buildTxQuery('baseId'))
        ]);

        // Group transactions by Asset Type
        const assetStats = {};

        // Initialize with current inventory assets
        currentInventory.forEach(item => {
            assetStats[item.assetType] = {
                currentClosing: item.closingBalance,
                rangePurchases: 0,
                rangeTransferIn: 0,
                rangeTransferOut: 0,
                rangeAssigned: 0,
                rangeExpended: 0,
                futureNetChange: 0 // Change from EndDate to Now
            };
        });

        // Helper to process transactions
        const processTx = (txs, type, isAddition, isFutureOnly = false) => {
            txs.forEach(tx => {
                if (!assetStats[tx.assetType]) return; // Skip if asset not in current inventory (edge case)

                const txDate = new Date(tx.date);
                const isAfterRange = txDate > end;
                const quantity = tx.quantity || 0;

                if (isAfterRange) {
                    // This transaction happened AFTER the selected range.
                    // We need to reverse it to find the Closing Balance at EndDate.
                    // If it added stock (Purchase/TransferIn), it increased the CurrentClosing. So we subtract it.
                    // If it removed stock, it decreased CurrentClosing. So we add it.
                    if (isAddition) {
                        assetStats[tx.assetType].futureNetChange += quantity;
                    } else {
                        assetStats[tx.assetType].futureNetChange -= quantity;
                    }
                } else {
                    // This transaction happened WITHIN the selected range.
                    // We count it for the metrics.
                    if (type === 'purchase') assetStats[tx.assetType].rangePurchases += quantity;
                    if (type === 'transferIn') assetStats[tx.assetType].rangeTransferIn += quantity;
                    if (type === 'transferOut') assetStats[tx.assetType].rangeTransferOut += quantity;
                    if (type === 'assigned') assetStats[tx.assetType].rangeAssigned += quantity;
                    if (type === 'expended') assetStats[tx.assetType].rangeExpended += quantity;
                }
            });
        };

        processTx(purchases, 'purchase', true);
        processTx(transfersIn, 'transferIn', true);
        processTx(transfersOut, 'transferOut', false);

        // Assignments need special handling for type
        assignments.forEach(tx => {
            if (!assetStats[tx.assetType]) return;
            const txDate = new Date(tx.date);
            const isAfterRange = txDate > end;
            const quantity = tx.quantity || 0;
            const isExpended = tx.type === 'expended';

            if (isAfterRange) {
                // Removed from stock, so we add back to reverse
                assetStats[tx.assetType].futureNetChange -= quantity;
            } else {
                if (isExpended) {
                    assetStats[tx.assetType].rangeExpended += quantity;
                } else {
                    assetStats[tx.assetType].rangeAssigned += quantity;
                }
            }
        });

        // Construct Final Dashboard Data
        const dashboard = Object.keys(assetStats).map(type => {
            const stats = assetStats[type];

            // Closing Balance at EndDate = CurrentClosing - FutureNetChange
            // Example: Current is 100. Tomorrow I buy 10. FutureNetChange is +10. Closing at EndDate was 90.
            const historicalClosing = stats.currentClosing - stats.futureNetChange;

            // Net Movement during Range
            const rangeNetMovement = stats.rangePurchases + stats.rangeTransferIn - stats.rangeTransferOut - stats.rangeAssigned - stats.rangeExpended;

            // Opening Balance at StartDate = HistoricalClosing - RangeNetMovement
            const historicalOpening = historicalClosing - rangeNetMovement;

            return {
                assetType: type,
                openingBalance: historicalOpening,
                purchases: stats.rangePurchases,
                transferIn: stats.rangeTransferIn,
                transferOut: stats.rangeTransferOut,
                assigned: stats.rangeAssigned,
                expended: stats.rangeExpended,
                closingBalance: historicalClosing,
                netMovement: rangeNetMovement
            };
        });

        res.json({ dashboard });

    } catch (err) {
        console.error("Dashboard Error:", err);
        res.status(500).json({ message: "Dashboard error", error: err.message });
    }
});

module.exports = router;
