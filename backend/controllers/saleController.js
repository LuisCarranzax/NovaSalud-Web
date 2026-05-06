const Sale = require('../models/Sale');
const Product = require('../models/Products');

// @desc    Registrar una nueva venta y actualizar stock
// @route   POST /api/sales
const createSale = async (req, res) => {
    try {
        const { items, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No hay productos en la venta' });
        }

        let totalCalculated = 0;

        for (const item of items) {
            const product = await Product.findById(item.productId);
            
            if (!product) {
                return res.status(404).json({ message: `Producto ${item.productId} no encontrado` });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({ 
                    message: `Stock insuficiente para ${product.name}. Disponible: ${product.stock}` 
                });
            }

            totalCalculated += item.price * item.quantity;
        }

        const sale = new Sale({
            items,
            totalAmount: totalCalculated,
            paymentMethod
        });

        const savedSale = await sale.save();

        for (const item of items) {
            await Product.findByIdAndUpdate(item.productId, {
                $inc: { stock: -item.quantity, salesCount: item.quantity }
            });
        }

        res.status(201).json(savedSale);
    } catch (error) {
        res.status(400).json({ message: 'Error al procesar la venta', error: error.message });
    }
};

// @desc    Obtener historial de ventas
// @route   GET /api/sales
const getSales = async (req, res) => {
    try {
        const sales = await Sale.find().sort({ createdAt: -1 }).populate('items.productId');
        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener ventas', error: error.message });
    }
};

module.exports = { createSale, getSales };