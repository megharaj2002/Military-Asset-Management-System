const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
    baseId: { type: mongoose.Schema.Types.ObjectId, ref: "Base", required: true },
    assetType: { type: String, required: true },
    openingBalance: { type: Number, default: 0 },
    purchases: { type: Number, default: 0 },
    transferIn: { type: Number, default: 0 },
    transferOut: { type: Number, default: 0 },
    assigned: { type: Number, default: 0 },
    expended: { type: Number, default: 0 },
    closingBalance: { type: Number, default: 0 }
});

module.exports = mongoose.model("Inventory", inventorySchema);
