const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const productRoutes = require('./routes/productRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

app.use(express.json());

app.use('/api', productRoutes);
app.use('/api', reservationRoutes);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});