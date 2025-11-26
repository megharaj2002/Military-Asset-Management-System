const express = require("express");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const cors = require("cors");
const morgan = require("morgan");
dotenv.config();
const authRoutes = require('./routes/auth');
const purchaseRoutes = require("./routes/purchase");
const transferRoutes = require('./routes/transfer');
const assignmentRoutes = require('./routes/assignments');





const app = express();

app.use(cors({
    origin: ['https://military-asset-management-system-delta.vercel.app', 'http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
}));
app.use(express.json());

app.use(morgan('dev'));
app.use('/api', authRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/logs', require('./routes/logs'));


app.get('/', (rwq, res) => {
    res.send('serveer is running');
});

//connect to mongoose
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected');
        app.listen(process.env.PORT || 5000, () =>
            console.log(`Server running on port ${process.env.PORT}`)
        );
    })
    .catch(err => console.error('DB connection error:', err));