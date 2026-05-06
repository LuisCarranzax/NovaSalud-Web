import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export const usePOS = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [cart, setCart] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('Efectivo');
    const [products, setProducts] = useState([]);

    const categories = ['Todos', 'Medicinas', 'Cuidado Personal', 'Fórmulas Infantiles'];

    // 1. Cargar productos desde MongoDB al iniciar
    useEffect(() => {
        const loadProducts = async () => {
            try {
                const res = await api.get('/products');
                setProducts(res.data);
            } catch (err) {
                toast.error('Error al conectar con el inventario');
            }
        };
        loadProducts();
    }, []);

    // 2. Lógica de Precios Fraccionados
    const getPriceByUnit = (product, unitType) => {
        if (unitType === 'Cajas') return product.priceBox || 0;
        if (unitType === 'Tabletas') return product.priceTablet || 0;
        return product.priceUnit || 0;
    };

    // 3. Control del Carrito
    const addToCart = (product) => {
        if (product.stock === 0) return toast.error('Sin stock disponible');
        const existingItem = cart.find(item => item._id === product._id);
        
        if (existingItem) {
            if (existingItem.quantity >= product.stock) return toast.error(`Solo hay ${product.stock} disponibles`);
            setCart(cart.map(item => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item));
        } else {
            const initialPrice = getPriceByUnit(product, product.unit);
            setCart([...cart, { ...product, quantity: 1, selectedUnit: product.unit, currentPrice: initialPrice }]);
        }
    };

    const updateQuantity = (id, delta) => {
        setCart(cart.map(item => {
            if (item._id === id) {
                const newQuantity = item.quantity + delta;
                const productDb = products.find(p => p._id === id);
                if (newQuantity > productDb.stock) { toast.error(`Stock máximo: ${productDb.stock}`); return item; }
                if (newQuantity === 0) return null;
                return { ...item, quantity: newQuantity };
            }
            return item;
        }).filter(Boolean));
    };

    const updateUnit = (id, newUnit) => {
        setCart(cart.map(item => {
            if (item._id === id) {
                const newPrice = getPriceByUnit(item, newUnit);
                if (newPrice === 0) toast.error(`No hay precio registrado para ${newUnit}`);
                return { ...item, selectedUnit: newUnit, currentPrice: newPrice };
            }
            return item;
        }));
    };

    const removeFromCart = (id) => setCart(cart.filter(item => item._id !== id));

    const totalAmount = Array.isArray(cart) 
        ? cart.reduce((sum, item) => sum + (Number(item?.currentPrice) * Number(item?.quantity) || 0), 0) 
        : 0;

    // 4. Procesar Venta en MongoDB
    const handleProcessSale = async () => {
        if (cart.length === 0) return toast.error('El carrito está vacío');

        const saleData = {
            items: cart.map(item => ({
                productId: item._id,
                name: item.name,
                category: item.category,
                quantity: item.quantity,
                price: item.currentPrice,
                unit: item.selectedUnit
            })),
            paymentMethod
        };

        try {
            await api.post('/sales', saleData);
            toast.success('¡Venta registrada exitosamente!', {
                style: { background: '#10b981', color: '#fff', fontWeight: 'bold' }
            });
            setCart([]);
            
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (error) {
            toast.error('No se concretó la venta. Intente nuevamente.', {
                style: { background: '#ef4444', color: '#fff', fontWeight: 'bold' }
            });
        }
    };

    // 5. Filtros
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return {
        searchTerm, setSearchTerm,
        selectedCategory, setSelectedCategory, categories,
        cart, paymentMethod, setPaymentMethod,
        filteredProducts, totalAmount,
        addToCart, updateQuantity, updateUnit, removeFromCart, handleProcessSale
    };
};