const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require('../models/User');
const Inventory = require('../models/Inventory');
const { default: mongoose } = require("mongoose");


//create a post request
router.post('/seed-admin', async (req, res) => {
    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash('admin123', 10);

    try {
        const user = await User.create({
            email: 'admin@example.com',
            passwordHash: hash,
            role: 'admin',
            baseId: '64edbe123abc4567890def12' // Use your base ID or leave empty for now
        });

        res.json({ message: 'Admin user created ', user });
    } catch (err) {
        res.status(500).json({ message: 'Error creating user', error: err.message });
    }
});
router.post('/seed-logistics', async (req, res) => {
    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash('admin123', 10);

    try {
        const user = await User.create({
            email: 'logi@example.com',
            passwordHash: hash,
            role: 'logistics',
            baseId: '64edbe123abc4567890def12' // same base as admin
        });

        res.json({ message: 'Logistics user created ', user });
    } catch (err) {
        res.status(500).json({ message: 'Error creating logistics user', error: err.message });
    }
});
router.post('/seed-commander', async (req, res) => {
    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash('admin123', 10);

    try {
        const user = await User.create({
            email: 'commander@example.com',
            passwordHash: hash,
            role: 'commander',
            baseId: '64edbe123abc4567890def12' // same base as others
        });

        res.json({ message: 'Commander user created ', user });
    } catch (err) {
        res.status(500).json({ message: 'Error creating commander user', error: err.message });
    }
});
router.post('/seed-inventory', async (req, res) => {
    try {
        const items = [
            {
                assetType: 'Rifle',
                openingBalance: 100,
                purchases: 30,
                transferIn: 10,
                transferOut: 5,
                assigned: 25,
                expended: 2,
                closingBalance: 108,
                baseId: '64edbe123abc4567890def12'
            },
            {
                assetType: 'Ammo',
                openingBalance: 200,
                purchases: 100,
                transferIn: 20,
                transferOut: 10,
                assigned: 80,
                expended: 15,
                closingBalance: 215,
                baseId: '64edbe123abc4567890def12'
            }
        ];

        await Inventory.insertMany(items);
        res.json({ message: 'Seeded successfully!' });
    } catch (err) {
        res.status(500).json({ message: 'Seeding error', error: err.message });
    }
});



router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);

    console.log("login attempt", email, password);

    try {
        //check if user exist
        const emailTrimmed = email.trim().toLowerCase();
        const isuserexist = await User.findOne({ email: emailTrimmed });
        console.log("user found", isuserexist);

        if (!isuserexist) {
            return res.status(404).json({
                message: "USer not found",
            });
        }
        //compare password
        const ismatch = await bcrypt.compare(password, isuserexist.passwordHash);
        console.log("Password match result:", ismatch);
        if (!ismatch) {
            console.log("Password mismatch for user:", email);
            return res.status(401).json({
                message: 'Invalid credentials',
            });
        }
        //generate jwt toke
        const token = jwt.sign({
            id: isuserexist._id,
            role: isuserexist.role,
            baseId: isuserexist.baseId,

        }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({
            message: "Login errror",
            error: err.message
        });
    }
});

module.exports = router;