import React from 'react';
import '../css/ExportData.css'; // Asegúrate de tener este archivo CSS para los estilos específicos de esta página
import { FileText, FileSpreadsheet, FileArchive, TrendingUp } from 'lucide-react';

const ExportData = () => {
    const handleExportPDF = (reportType) => {
        alert(`Generando PDF para: ${reportType}. Aquí conectaremos la librería jsPDF.`);
    };

    const handleExportExcel = (reportType) => {
        alert(`Generando Excel para: ${reportType}. Aquí conectaremos la librería xlsx.`);
    };

    return (
        <div className="export-page">
            <div className="export-header">
                <h1>Reportes y Exportación</h1>
                <p>Genera y descarga la información del sistema en formatos estándar</p>
            </div>

            <div className="export-grid">
                
                {/* Tarjeta de Inventario */}
                <div className="export-card">
                    <div className="card-top">
                        <div className="icon-box bg-farma-light">
                            <FileArchive size={24} />
                        </div>
                        <div>
                            <h2>Estado del Inventario</h2>
                            <p>Stock actual, precios y fechas</p>
                        </div>
                    </div>
                    
                    <div className="export-features">
                        <ul>
                            <li><div className="bullet bullet-farma"></div>Lista completa de productos registrados</li>
                            <li><div className="bullet bullet-farma"></div>Identificación de stock crítico</li>
                            <li><div className="bullet bullet-farma"></div>Valorización total del almacén</li>
                        </ul>
                    </div>

                    <div className="export-actions">
                        <button onClick={() => handleExportPDF('Inventario')} className="btn-export btn-pdf">
                            <FileText size={18} /> Exportar PDF
                        </button>
                        <button onClick={() => handleExportExcel('Inventario')} className="btn-export btn-excel">
                            <FileSpreadsheet size={18} /> Exportar Excel
                        </button>
                    </div>
                </div>

                {/* Tarjeta de Ventas */}
                <div className="export-card">
                    <div className="card-top">
                        <div className="icon-box bg-indigo-light">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <h2>Historial de Ventas</h2>
                            <p>Transacciones y movimiento de caja</p>
                        </div>
                    </div>
                    
                    <div className="export-features">
                        <ul>
                            <li><div className="bullet bullet-indigo"></div>Registro de todas las transacciones</li>
                            <li><div className="bullet bullet-indigo"></div>Ingresos totales por método de pago</li>
                            <li><div className="bullet bullet-indigo"></div>Productos más vendidos (Ranking)</li>
                        </ul>
                    </div>

                    <div className="export-actions">
                        <button onClick={() => handleExportPDF('Ventas')} className="btn-export btn-pdf">
                            <FileText size={18} /> Exportar PDF
                        </button>
                        <button onClick={() => handleExportExcel('Ventas')} className="btn-export btn-excel">
                            <FileSpreadsheet size={18} /> Exportar Excel
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ExportData;