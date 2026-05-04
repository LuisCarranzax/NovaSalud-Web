
//Modulos

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

//Rutas
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/sales', require('./routes/saleRoutes'));

app.get('/api/status', (req, res) => {
    res.status(200).json({
        message: 'Servidor funcionando correctamente',
        status: 'OK'
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`[Servidor] corriendo en puerto ${PORT}`);
    console.log(`[Servidor] conectado a MongoDB`);
    console.log(`[Ruta de prueba] API disponible en http://localhost:${PORT}/api/status`);
});