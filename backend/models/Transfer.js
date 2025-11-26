const mongoose = require("mongoose");

const transferSchema = new mongoose.Schema({
    fromBaseId: { type: mongoose.Schema.Types.ObjectId, ref: "Base", required: true },
    toBaseId: { type: mongoose.Schema.Types.ObjectId, ref: "Base", required: true },
    assetType: { type: String, required: true },
    quantity: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Transfer", transferSchema);
