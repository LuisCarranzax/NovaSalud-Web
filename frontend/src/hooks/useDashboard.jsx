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
    const [activityFeed, setActivityFeed] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
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
                    let status = 'green';
                    
                    if (p.stock === 0) {
                        status = 'red';
                        outOfStockCount++;
                    } else if (p.stock <= p.minStock) {
                        status = 'yellow';
                        criticalCount++;
                    }

                    return { ...p, status };
                });

                processedStock.sort((a, b) => {
                    const order = { red: 1, yellow: 2, green: 3 };
                    return order[a.status] - order[b.status];
                });

                // 3. Calcular Nuevos Ingresos (Últimos 7 días)
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                const newProds = products.filter(p => new Date(p.createdAt) >= sevenDaysAgo).length;

                // 4. Construir "Últimos Movimientos" (Activity Feed)
                const recentSales = sales.map(s => ({
                    id: `sale-${s._id}`,
                    type: 'SALE',
                    message: `Venta registrada (${s.items.reduce((acc, item) => acc + item.quantity, 0)} items)`,
                    amount: s.totalAmount,
                    date: new Date(s.createdAt)
                }));

                const recentProducts = products.map(p => ({
                    id: `prod-${p._id}`,
                    type: 'ADD',
                    message: `Ingreso al inventario: ${p.name}`,
                    amount: null,
                    date: new Date(p.createdAt || p.supplyDate || Date.now()) 
                }));

                const combinedActivity = [...recentSales, ...recentProducts]
                    .sort((a, b) => b.date - a.date)
                    .slice(0, 6);

                setStats({
                    todaySales,
                    criticalStock: criticalCount,
                    newProducts: newProds,
                    suggestedOrders: criticalCount + outOfStockCount
                });
                
                setStockList(processedStock);
                setActivityFeed(combinedActivity);
            } catch (error) {
                toast.error('Error al cargar métricas del Dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return { stats, stockList, loading, activityFeed };
};