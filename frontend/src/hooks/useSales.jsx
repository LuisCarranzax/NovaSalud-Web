import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export const useSales = () => {
    const today = new Date().toISOString().split('T')[0];
    const [filterDate, setFilterDate] = useState(today);
    const [searchTerm, setSearchTerm] = useState('');
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        try {
            const response = await api.get('/sales');
            setSales(response.data);
        } catch (error) {
            toast.error('Error al cargar historial de ventas');
        } finally {
            setLoading(false);
        }
    };

    const filteredSales = sales.filter(sale => {
        const saleDate = sale.createdAt.split('T')[0];
        const matchDate = filterDate ? saleDate === filterDate : true;
        const matchSearch = sale._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            sale.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase());
        return matchDate && matchSearch;
    });

    const dailyTotal = filteredSales.reduce((sum, sale) => sum + sale.totalAmount, 0);

    return {
        filterDate, setFilterDate,
        searchTerm, setSearchTerm,
        filteredSales, dailyTotal, loading
    };
};