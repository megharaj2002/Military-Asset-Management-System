const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
    baseId: { type: mongoose.Schema.Types.ObjectId, ref: "Base", required: true },
    assetType: { type: String, required: true },
    quantity: { type: Number, required: true },
    assignedTo: { type: String, required: true },
    type: {
        type: String,
        enum: ['assigned', 'expended'],
        default: 'assigned'
    },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Assignment", assignmentSchema);
