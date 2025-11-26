const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
    assetType: { type: String, required: true },
    quantity: { type: Number, required: true },
    baseId: { type: mongoose.Schema.Types.ObjectId, ref: "Base", required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Purchase", purchaseSchema);
