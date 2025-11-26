const mongoose = require('mongoose');

const baseScheme = mongoose.Schema({
    name: { type: String, required: true },
    location: String,
});


module.export = mongoose.model('Base', baseScheme);