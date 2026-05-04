import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api'; // Importamos nuestra conexión a Axios

export const useInventory = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [errors, setErrors] = useState({});


    const initialFormState = {
    name: '', category: '', priceBox: '', priceTablet: '', priceUnit: '', stock: '', minStock: '', expirationDate: '', unit: 'Unidades', supplyDate: ''
    };
    const [formData, setFormData] = useState(initialFormState);
    
    // El arreglo ahora inicia vacío. Se llenará desde la base de datos.
    const [products, setProducts] = useState([]);

    // 1. LEER (GET): Obtener productos al cargar la página
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            // Como las fechas vienen con formato ISO (ej. 2025-10-15T00:00:00.000Z), 
            // las formateamos a YYYY-MM-DD para que los inputs tipo "date" las lean bien
            const formattedProducts = response.data.map(p => ({
                ...p,
                expirationDate: p.expirationDate ? p.expirationDate.split('T')[0] : ''
            }));
            setProducts(formattedProducts);
        } catch (error) {
            toast.error('Error al cargar el inventario desde el servidor');
            console.error(error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors({ ...errors, [name]: null });
    };

    const handleOpenCreate = () => {
        setFormData(initialFormState);
        setEditingId(null);
        setErrors({});
        setIsModalOpen(true);
    };

    const handleOpenEdit = (product) => {
        setFormData({ ...product });
        setEditingId(product._id);
        setErrors({});
        setIsModalOpen(true);
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.name.trim()) newErrors.name = "El nombre es obligatorio";
        if (!formData.category) newErrors.category = "Selecciona una categoría";

        // Validación: Al menos uno de los precios debe ser mayor a 0
        if (!(formData.priceBox > 0 || formData.priceTablet > 0 || formData.priceUnit > 0)) {
            newErrors.price = "Debes ingresar al menos un precio válido";
        }

        if (formData.stock === '' || formData.stock < 0) newErrors.stock = "Ingresa un stock válido";
        if (formData.minStock === '' || formData.minStock < 0) newErrors.minStock = "Ingresa un stock mínimo";
        if (!formData.expirationDate) newErrors.expirationDate = "La fecha es obligatoria";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // 2. CREAR Y ACTUALIZAR (POST / PUT)
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Por favor, corrige los errores del formulario');
            return;
        }

        const processedData = {
            ...formData,
            priceBox: parseFloat(formData.priceBox) || 0,
            priceTablet: parseFloat(formData.priceTablet) || 0,
            priceUnit: parseFloat(formData.priceUnit) || 0,
            stock: parseInt(formData.stock) || 0,
            minStock: parseInt(formData.minStock) || 0
        };

        try {
            if (editingId) {
                // ACTUALIZAR (PUT)
                const response = await api.put(`/products/${editingId}`, processedData);
                
                // Formatear la fecha que devuelve el servidor
                const updatedProduct = {
                    ...response.data,
                    expirationDate: response.data.expirationDate.split('T')[0]
                };

                setProducts(products.map(p => p._id === editingId ? updatedProduct : p));
                toast.success('Producto actualizado exitosamente');
            } else {
                // CREAR (POST)
                const response = await api.post('/products', processedData);
                
                const newProduct = {
                    ...response.data,
                    expirationDate: response.data.expirationDate.split('T')[0]
                };

                setProducts([newProduct, ...products]);
                toast.success('Producto registrado correctamente');
            }
            setIsModalOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al guardar el producto');
        }
    };

    // 3. ELIMINAR (DELETE)
    const handleDelete = (id) => {
        toast((t) => (
            <div className="flex flex-col gap-3">
                <span className="font-medium text-slate-800">¿Eliminar este producto de la base de datos?</span>
                <div className="flex gap-2">
                    <button 
                        onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                                await api.delete(`/products/${id}`);
                                setProducts(products.filter(p => p._id !== id));
                                toast.success('Producto eliminado del sistema');
                            } catch (error) {
                                toast.error('Error al intentar eliminar');
                            }
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                        Eliminar
                    </button>
                    <button 
                        onClick={() => toast.dismiss(t.id)}
                        className="bg-slate-200 text-slate-700 px-3 py-1 rounded text-sm hover:bg-slate-300"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        ), { duration: 5000 });
    };

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return {
        searchTerm, setSearchTerm, isModalOpen, setIsModalOpen,
        editingId, formData, errors, filteredProducts,
        handleInputChange, handleOpenCreate, handleOpenEdit, handleSubmit, handleDelete
    };
};