import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export const useDashboard = () => {
    const [stats, setStats] = useState({
        todaySales: 0,
        criticalStock: 0,
        newProducts: 0,
        suggestedOrders: 0
    });
    const [stockList, setStockList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Hacemos las dos peticiones al mismo tiempo para mayor velocidad
                const [salesRes, productsRes] = await Promise.all([
                    api.get('/sales'),
                    api.get('/products')
                ]);

                const sales = salesRes.data;
                const products = productsRes.data;

                // 1. Calcular Ventas de Hoy
                const today = new Date().toISOString().split('T')[0];
                const todaySales = sales
                    .filter(sale => sale.createdAt.startsWith(today))
                    .reduce((sum, sale) => sum + sale.totalAmount, 0);

                // 2. Procesar Semáforo de Stock y Alertas
                let criticalCount = 0;
                let outOfStockCount = 0;

                const processedStock = products.map(p => {
                    let status = 'green'; // Buen stock
                    
                    if (p.stock === 0) {
                        status = 'red'; // Agotado
                        outOfStockCount++;
                    } else if (p.stock <= p.minStock) {
                        status = 'yellow'; // Crítico / Por agotar
                        criticalCount++;
                    }

                    return { ...p, status };
                });

                // Ordenar la lista: Primero los rojos, luego amarillos, luego verdes
                processedStock.sort((a, b) => {
                    const order = { red: 1, yellow: 2, green: 3 };
                    return order[a.status] - order[b.status];
                });

                // 3. Calcular Nuevos Ingresos (Últimos 7 días)
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                const newProds = products.filter(p => new Date(p.createdAt) >= sevenDaysAgo).length;

                // Actualizar estados
                setStats({
                    todaySales,
                    criticalStock: criticalCount,
                    newProducts: newProds,
                    suggestedOrders: criticalCount + outOfStockCount // Todo lo que esté en amarillo o rojo
                });
                
                setStockList(processedStock);

            } catch (error) {
                toast.error('Error al cargar métricas del Dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return { stats, stockList, loading };
};