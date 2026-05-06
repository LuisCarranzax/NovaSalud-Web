const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'El nombre del producto es obligatorio'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        required: [true, 'La categoría es obligatoria']
    },
    unit: {
        type: String,
        enum: ['Cajas', 'Tabletas', 'Unidades'],
        default: 'Unidades'
    },
    priceBox: {
        type: Number,
        default: 0
    },
    priceTablet: {
        type: Number,
        default: 0
    },
    priceUnit: {
        type: Number,
        default: 0
    },
    stock: {
        type: Number,
        required: [true, 'El stock actual es obligatorio'],
        min: [0, 'El stock no puede ser negativo'],
        default: 0
    },
    minStock: {
        type: Number,
        required: [true, 'El stock mínimo es obligatorio para las alertas'],
        default: 10
    },
    expirationDate: {
        type: Date,
        required: [true, 'La fecha de vencimiento es obligatoria']
    },
    supplyDate: {
        type: Date,
        default: Date.now // Si no se pone, toma la fecha actual
    },
    // ... resto del esquema
    supplier: {
        type: String,
        trim: true
    },
    salesCount: {
        type: Number,
        default: 0 
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);