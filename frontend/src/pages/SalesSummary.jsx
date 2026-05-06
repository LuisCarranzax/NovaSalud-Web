import React from 'react';
import '../css/SalesSummary.css';
import { Calendar, Search, Receipt, TrendingUp, FileText, FileSpreadsheet } from 'lucide-react';
import { useSales } from '../hooks/useSales'; // Importamos la conexión real

const SalesSummary = () => {
    const {
        filterDate, setFilterDate,
        searchTerm, setSearchTerm,
        filteredSales, dailyTotal, loading, 
        exportSalesPDF, exportSalesExcel
    } = useSales();

    return (
        <div className="sales-page">
            <div className="sales-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1>Resumen de Ventas</h1>
                    <p>Historial de transacciones y cuadre de caja diario</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={exportSalesPDF} className="btn-cancel" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626', background: 'white', border: '1px solid #fecaca' }}>
                        <FileText size={18} /> PDF
                    </button>

                    <button onClick={exportSalesExcel} className="btn-cancel" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', background: 'white', border: '1px solid #a7f3d0' }}>
                        <FileSpreadsheet size={18} /> Excel
                    </button>
                </div>
            </div>

            <div className="summary-card">
                <div>
                    <p>Ingresos del periodo filtrado</p>
                    <h2>S/ {dailyTotal.toFixed(2)}</h2>
                </div>
                <div className="summary-icon">
                    <TrendingUp size={32} />
                </div>
            </div>

            <div className="sales-filters">
                <div className="filter-group">
                    <Search color="#94a3b8" style={{ position: 'absolute', marginLeft: '12px' }} size={20} />
                    <input 
                        type="text" 
                        placeholder="Buscar por ID o Método..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    <Calendar color="#94a3b8" style={{ position: 'absolute', marginLeft: '12px' }} size={20} />
                    <input 
                        type="date" 
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                    />
                </div>
                <button onClick={() => setFilterDate('')} className="btn-clear">
                    Ver Todo
                </button>
            </div>

            <div className="sales-table-container">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Cargando ventas...</div>
                ) : (
                    <table className="sales-table">
                        <thead>
                            <tr>
                                <th>N° Transacción</th>
                                <th>Producto</th>
                                <th>Fecha y Hora</th>
                                <th>Cant. Productos</th>
                                <th>Método</th>
                                <th>Monto Total</th>
                                <th style={{ textAlign: 'center' }}>Ticket</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSales.map((sale) => {
                                const dateObj = new Date(sale.createdAt);
                                const dateStr = dateObj.toLocaleDateString();
                                const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                
                                const totalItems = sale.items.reduce((sum, item) => sum + item.quantity, 0);

                                return (
                                    <tr key={sale._id}>
                                        <td><strong>{sale._id.substring(sale._id.length - 6).toUpperCase()}</strong></td>
                                        <td>
                                            <strong>{sale.items.map(item => item.name || (item.productId && item.productId.name) || 'Producto Desconocido').join(', ')}</strong>
                                            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                                                {sale.items.map(item => item.category || (item.productId && item.productId.category) || 'Sin Categoría').join(', ')}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span>{dateStr}</span>
                                                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{timeStr}</span>
                                            </div>
                                        </td>
                                        <td>{totalItems} items</td>
                                        <td>
                                            <span className={`badge-method ${sale.paymentMethod === 'Efectivo' ? 'badge-efectivo' : 'badge-tarjeta'}`}>
                                                {sale.paymentMethod}
                                            </span>
                                        </td>
                                        <td>
                                            <strong>S/ {sale.totalAmount.toFixed(2)}</strong>
                                            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
                                                {sale.items.map(item => item.unit || 'Unidad').join(', ')}
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <button className="btn-icon" title="Ver detalle">
                                                <Receipt size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredSales.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                                        No hay registros de ventas para esta fecha.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default SalesSummary;