const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        name: String,
        category: String,
        unit: String,
        quantity: {
            type: Number,
            required: true,
            min: [1, 'La cantidad mínima es 1']
        },
        price: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true,
        default: 0
    },
    paymentMethod: {
        type: String,
        enum: ['Efectivo', 'Tarjeta', 'Transferencia'],
        default: 'Efectivo'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Sale', saleSchema);