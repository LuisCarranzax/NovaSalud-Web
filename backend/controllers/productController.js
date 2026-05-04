const Product = require('../models/Products');



//GET
const getProducts = async (req, res) =>{
    try{
        const products = await Product.find().sort({createdAt: -1});
        res.status(200).json(products);


    }catch(error){
        res.status(500).json({message: 'Error al obtener productos', error: error.message});
    }
};
//POST
const createProduct = async (req, res) => {
    try{
        const {name, category, price, stock, minStock, expirationDate} = req.body;

        if(!name || !category || price === undefined || stock === undefined || minStock === undefined || !expirationDate){
            return res.status(400).json({
                message: 'Todos los campos obligatorios deben ser completados'});
        }

        const product = new Product(req.body);
        const savedProduct = await product.save();

        res.status(201).json(savedProduct);
    }catch(error){
        res.status(500).json({
            message: 'Error al crear producto',
            error: error.message
        })
    }
};

//PUT
const updateProduct = async (req, res) =>{
    try{
        const {id} = req.params;

        const updateProduct = await Product.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });

        if(!updateProduct){
            return res.status(404).json({
                messae: 'Producto no encontrado'
            });
        }

        res.status(200).json(updateProduct);
    }catch(error){
        res.status(500).json({
            message:'Error al actualizar el producto',
            error: error.message
        });
    }
};

//DELETE
const deleteProduct = async(req,res) =>{
    try{
        const {id} = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);

        if(!deleteProduct){
            return res.status(404).json({
                message: 'Producto no encontrado'
            });
        }

        res.status(200).json({
            message: 'Producto eliminado correctamente'
        })
    }catch(error){
        res.status(500).json({
            message: 'Error al eliminar el producto',
            error: error.message
        });

    }
};

module.exports = {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
};