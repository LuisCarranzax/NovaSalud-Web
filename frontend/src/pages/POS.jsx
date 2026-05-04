import React from 'react';
import '../css/POS.css';
import { Search, ShoppingCart, Plus, Minus, Trash2, CreditCard, Banknote, CheckCircle2 } from 'lucide-react';
import { usePOS } from '../hooks/usePOS';

const POS = () => {
    // Importamos toda la lógica desde nuestro Custom Hook
    const {
        searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, categories,
        cart, paymentMethod, setPaymentMethod, filteredProducts, totalAmount,
        addToCart, updateQuantity, updateUnit, removeFromCart, handleProcessSale
    } = usePOS();

    return (
        <div className="pos-page">
            {/* Panel Izquierdo: Catálogo */}
            <div className="pos-catalog">
                <div className="pos-header">
                    <h1>Punto de Venta</h1>
                    <p>Registra las transacciones en tiempo real</p>
                </div>

                <div className="search-container">
                    <Search color="#94a3b8" style={{ position: 'absolute', marginLeft: '12px' }} />
                    <input 
                        type="text" 
                        placeholder="Buscar producto para la venta..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                    />
                </div>

                <div className="filter-chips">
                    {categories.map(cat => (
                        <button 
                            key={cat} 
                            onClick={() => setSelectedCategory(cat)} 
                            className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="products-grid">
                    {filteredProducts.map((product) => (
                        <button key={product._id} onClick={() => addToCart(product)} disabled={product.stock === 0} className="product-card">
                            <span className="product-badge">{product.category}</span>
                            <p className="product-name">{product.name}</p>
                            <p className={`product-stock ${product.stock === 0 ? 'empty' : ''}`}>
                                {product.stock > 0 ? `Stock: ${product.stock} ${product.unit.substring(0,3)}.` : 'Agotado'}
                            </p>
                            <div className="product-bottom">
                                {/* Mostramos el precio base referencial (Unidad o Caja) */}
                                <span className="product-price">S/ {(product.priceUnit || product.priceBox || 0).toFixed(2)}</span>
                                <div className="add-btn" style={{ background: product.stock > 0 ? '#0ea5e9' : '#cbd5e1' }}>
                                    <Plus size={18} />
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Panel Derecho: Carrito */}
            <div className="pos-cart">
                <div className="cart-header">
                    <ShoppingCart color="#e0f2fe" />
                    <h2>Ticket de Venta</h2>
                </div>

                <div className="cart-items">
                    {cart.length === 0 ? (
                        <div className="cart-empty"><ShoppingCart size={48} /><p>El carrito está vacío</p></div>
                    ) : (
                        cart.map((item) => (
                            <div key={item._id} className="cart-item">
                                <div className="item-info">
                                    <p>{item.name}</p>
                                    <div className="item-controls">
                                        <select className="unit-select" value={item.selectedUnit} onChange={(e) => updateUnit(item._id, e.target.value)}>
                                            <option value="Cajas">Cajas</option>
                                            <option value="Tabletas">Tabletas</option>
                                            <option value="Unidades">Unidades</option>
                                        </select>
                                        {/* Precio dinámico según la presentación elegida */}
                                        <span className="item-price">S/ {(item.currentPrice * item.quantity).toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="item-controls">
                                    <div className="qty-control">
                                        <button onClick={() => updateQuantity(item._id, -1)} className="qty-btn"><Minus size={14} /></button>
                                        <span className="qty-val">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item._id, 1)} className="qty-btn"><Plus size={14} /></button>
                                    </div>
                                    <button onClick={() => removeFromCart(item._id)} className="del-btn"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="cart-summary">
                    <div className="summary-row"><span>Subtotal</span><span>S/ {totalAmount.toFixed(2)}</span></div>
                    <div className="summary-total"><span>Total a Cobrar</span><span className="total-val">S/ {totalAmount.toFixed(2)}</span></div>
                    
                    <div className="payment-methods">
                        <button onClick={() => setPaymentMethod('Efectivo')} className={`pay-btn ${paymentMethod === 'Efectivo' ? 'active' : ''}`}>
                            <Banknote size={18}/> Efectivo
                        </button>
                        <button onClick={() => setPaymentMethod('Tarjeta')} className={`pay-btn ${paymentMethod === 'Tarjeta' ? 'active' : ''}`}>
                            <CreditCard size={18}/> Tarjeta
                        </button>
                    </div>

                    <button onClick={handleProcessSale} disabled={cart.length === 0} className="process-btn">
                        <CheckCircle2 /> Procesar Venta
                    </button>
                </div>
            </div>
        </div>
    );
};

export default POS;