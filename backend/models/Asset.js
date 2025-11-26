const mongoose = require("mongoose");

const assetScheme = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: String, //weapon,vechile
    unit: String, //liters
});

module.exports = mongoose.model('Asset', assetScheme);