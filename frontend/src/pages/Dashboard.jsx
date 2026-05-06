import React from 'react';
import '../css/Dashboard.css';
import { TrendingUp, AlertTriangle, PackagePlus, ShoppingCart, Loader2, CheckCircle2 } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';

const Dashboard = () => {
    const { stats, stockList, activityFeed, loading } = useDashboard();
    const statCards = [
        { title: "Ventas del Día", value: `S/ ${stats.todaySales.toFixed(2)}`, subtitle: "Total recaudado hoy", icon: TrendingUp, colorClass: "bg-emerald" },
        { title: "Stock Crítico", value: stats.criticalStock, subtitle: "Productos por agotar", icon: AlertTriangle, colorClass: "bg-red" },
        { title: "Nuevos Ingresos", value: stats.newProducts, subtitle: "Últimos 7 días", icon: PackagePlus, colorClass: "bg-blue" },
        { title: "Pedidos Sugeridos", value: stats.suggestedOrders, subtitle: "Basado en stock bajo", icon: ShoppingCart, colorClass: "bg-farma" },
    ];

    if (loading) {
        return (
            <div className="dashboard-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Loader2 className="animate-spin text-farmablue" size={48} />
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <h1>Resumen de Operaciones</h1>
                <p>Monitoreo en tiempo real de Nova Salud</p>
            </div>

            <div className="stats-grid">
                {statCards.map((stat, index) => (
                    <div key={index} className="stat-card">
                        <div className={`icon-wrapper ${stat.colorClass}`}>
                            <stat.icon size={28} />
                        </div>
                        <div className="stat-info">
                            <p>{stat.title}</p>
                            <h3>{stat.value}</h3>
                            <span>{stat.subtitle}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="content-grid">
                {/* Panel de Últimos Movimientos */}
                <div className="content-panel">
                    <h2>Últimos Movimientos</h2>
                    <div className="activity-feed">
                        {activityFeed.length === 0 ? (
                            <div className="empty-state">No hay movimientos recientes registrados.</div>
                        ) : (
                            activityFeed.map((activity) => (
                                <div key={activity.id} className="activity-item">
                                    <div className={`activity-icon ${activity.type === 'SALE' ? 'icon-sale' : 'icon-add'}`}>
                                        {activity.type === 'SALE' ? <ShoppingCart size={18} /> : <PackagePlus size={18} />}
                                    </div>
                                    <div className="activity-details">
                                        <p>{activity.message}</p>
                                        <span className="activity-time">
                                            {activity.date.toLocaleDateString()} - {activity.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {activity.type === 'SALE' && (
                                            <span className="activity-amount">+ S/ {activity.amount.toFixed(2)}</span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Semáforo de Stock */}
                <div className="content-panel">
                    <h2>Estado del Inventario</h2>
                    <div className="stock-list">
                        {stockList.map(product => (
                            <div key={product._id} className="stock-item">
                                <div className="stock-item-info">
                                    <p>{product.name}</p>
                                    <span>Min: {product.minStock} {product.unit.substring(0,3)}.</span>
                                </div>
                                <div className={`stock-indicator status-${product.status}`}>
                                    <div className="indicator-dot"></div>
                                    <span className="stock-text">
                                        {product.stock === 0 ? 'Agotado' : `${product.stock} ${product.unit.substring(0,3)}.`}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {stockList.length === 0 && (
                            <div className="empty-state">No hay productos registrados aún.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;