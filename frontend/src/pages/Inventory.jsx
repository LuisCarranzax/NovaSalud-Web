import React from 'react';
import { Search, Plus, Edit, Trash2, X } from 'lucide-react';
import { useInventory } from '../hooks/useInventory';
import { FileText, FileSpreadsheet } from 'lucide-react';
import '../css/Inventory.css'; // Asegúrate de tener este archivo CSS para los estilos específicos de esta página
const Inventory = () => {
    const {
        searchTerm, setSearchTerm, isModalOpen, setIsModalOpen,
        editingId, formData, errors, filteredProducts,
        handleInputChange, handleOpenCreate, handleOpenEdit, handleSubmit, handleDelete
    } = useInventory();

    return (
        <div className="inventory-page">
            <div className="inventory-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h1>Gestión de Productos</h1>
                    <p>Administra el inventario, precios y stock de Nova Salud</p>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button onClick={() => alert('Exportando PDF...')} className="btn-cancel" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626', background: 'white', border: '1px solid #fecaca' }}>
                        <FileText size={18} /> PDF
                    </button>
                    <button onClick={() => alert('Exportando Excel...')} className="btn-cancel" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', background: 'white', border: '1px solid #a7f3d0' }}>
                        <FileSpreadsheet size={18} /> Excel
                    </button>
                    <button onClick={handleOpenCreate} className="btn-primary">
                        <Plus size={20} /> Agregar Producto
                    </button>

                </div>
                    
            </div>

            <div className="search-bar">
                <div className="search-input-container">
                    <Search size={20} color="#94a3b8" style={{ position: 'absolute', marginLeft: '10px' }} />
                    <input 
                        type="text" 
                        placeholder="Buscar por nombre o categoría..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="table-container">
                <table className="inventory-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Categoría</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Vencimiento</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product) => (
                            <tr key={product._id}>
                                <td><strong>{product.name}</strong></td>
                                <td>{product.category}</td>
                                <td>S/ {Number(product.priceUnit || product.priceBox).toFixed(2)}</td>
                                <td>{product.stock} {product.unit}</td>
                                <td>{product.expirationDate}</td>
                                <td>
                                    <button onClick={() => handleOpenEdit(product)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b', marginRight: '10px' }}>
                                        <Edit size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(product._id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }}>
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{editingId ? 'Editar Producto' : 'Registrar Nuevo Producto'}</h2>
                            <button onClick={() => setIsModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>
                        
                        {/* BOTONES MOVIDOS ADENTRO DEL FORM */}
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Nombre del Producto</label>
                                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
                                        {errors.name && <p className="error-text">{errors.name}</p>}
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Categoría</label>
                                        <select name="category" value={formData.category} onChange={handleInputChange}>
                                            <option value="">Seleccione...</option>
                                            <option value="Medicinas">Medicinas</option>
                                            <option value="Cuidado Personal">Cuidado Personal</option>
                                            <option value="Fórmulas Infantiles">Fórmulas Infantiles</option>
                                        </select>
                                        {errors.category && <p className="error-text">{errors.category}</p>}
                                    </div>

                                    <div className="form-group">
                                        <label>Precio (S/)</label>
                                        <input type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} />
                                    </div>

                                    {/* Reemplaza el <div className="form-group"> del Precio antiguo por esto: */}
                                    <div className="form-group full-width">
                                        <span className="price-section-title">Precios de Venta (S/)</span>
                                        <div className="price-grid">
                                            <div>
                                                <label>Por Caja</label>
                                                <input type="number" step="0.01" name="priceBox" value={formData.priceBox} onChange={handleInputChange} placeholder="0.00" />
                                            </div>
                                            <div>
                                                <label>Por Tableta/Blíster</label>
                                                <input type="number" step="0.01" name="priceTablet" value={formData.priceTablet} onChange={handleInputChange} placeholder="0.00" />
                                            </div>
                                            <div>
                                                <label>Por Unidad/Pastilla</label>
                                                <input type="number" step="0.01" name="priceUnit" value={formData.priceUnit} onChange={handleInputChange} placeholder="0.00" />
                                            </div>
                                        </div>
                                        {errors.price && <p className="error-text">{errors.price}</p>}
                                    </div>
                                    <div className="form-group ">
                                        <label style={{ color: '#0ea5e9', borderBottom: '1px solid #e0f2fe', paddingBottom: '4px', marginBottom: '8px' }}>
                                            Stock y Unidad de Medida
                                        </label>
                                        <label>Stock Actual</label>
                                        <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} />
                                    </div>

                                    <div className="form-group">
                                        <label>Stock Mínimo</label>
                                        <input type="number" name="minStock" value={formData.minStock} onChange={handleInputChange} />
                                    </div>
                                    
                                    <div className="form-group full-width">
                                        <label>Fecha de Vencimiento</label>
                                        <input type="date" name="expirationDate" value={formData.expirationDate} onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Fecha de Abastecimiento</label>
                                        <input 
                                            type="date" 
                                            name="supplyDate" 
                                            value={formData.supplyDate || new Date().toISOString().split('T')[0]} 
                                            onChange={handleInputChange} 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-cancel">
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary">
                                    {editingId ? 'Actualizar Producto' : 'Guardar Producto'}
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;