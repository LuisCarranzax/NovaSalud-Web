import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from 'exceljs';
import { AuthContext } from '../context/AuthContext';


export const useInventory = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [supplyFilterDate, setSupplyFilterDate] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [errors, setErrors] = useState({});
    const { user } = useContext(AuthContext);



    const initialFormState = {
    name: '', category: '', priceBox: '', priceTablet: '', priceUnit: '', stock: '', minStock: '', expirationDate: '', unit: 'Unidades', supplyDate: ''
    };
    const [formData, setFormData] = useState(initialFormState);
    
    const [products, setProducts] = useState([]);

    // 1. LEER (GET): Obtener productos al cargar la página
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            const formattedProducts = response.data.map(p => ({
                ...p,
                expirationDate: p.expirationDate ? p.expirationDate.split('T')[0] : '',
                supplyDate: p.supplyDate ? p.supplyDate.split('T')[0] : ''
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

    const filteredProducts = products.filter(product => {
        // 1. Filtro por nombre o categoría
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             product.category.toLowerCase().includes(searchTerm.toLowerCase());
        
        // 2. Filtro por fecha de abastecimiento
        const productSupplyDate = product.supplyDate ? product.supplyDate.split('T')[0] : '';
        const matchesDate = supplyFilterDate === '' || productSupplyDate === supplyFilterDate;

        return matchesSearch && matchesDate;
    });

    const exportToPDF = () => {
        try {
            const doc = new jsPDF();
            const fileNameDate = supplyFilterDate || "Historial_Completo";
            const fileName = `Inv_NovaSalud_${fileNameDate}`;

            const tableColumn = ["Nombre", "Categoría", "Precio Proveedor", "Precio Caja", "Precio Blister", "Precio Unidad", "Stock", "Vencimiento", "Fecha Abastecimiento"];
            const tableRows = [];

            filteredProducts.forEach(p => {
                const productData = [
                    p.name,
                    p.category,
                    `S/ ${(p.priceSupplier || p.priceBox || 0).toFixed(2)}`,
                    `S/ ${(p.priceBox || p.priceUnit || 0).toFixed(2)}`,
                    `S/ ${(p.priceTablet || p.priceUnit || 0).toFixed(2)}`,
                    `S/ ${(p.priceUnit || p.priceBox || 0).toFixed(2)}`,
                    `${p.stock} ${p.unit.substring(0,3)}.`,
                    p.expirationDate,
                    p.supplyDate
                ];
                tableRows.push(productData);
            });

            doc.setFontSize(18);
            doc.text("Nova Salud - Reporte de Inventario", 14, 20);
            doc.setFontSize(11);
            doc.setTextColor(100);
            if (supplyFilterDate) {
                doc.text(`Tipo de reporte: Filtrado por fecha de abastecimiento: ${supplyFilterDate}`, 14, 30);
            } else {
                doc.text(`Tipo de reporte: Completo`, 14, 30);
            }
            doc.text(`Generado por: ${user?.nombre || 'Usuario'}`, 14, 40);
            doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 14, 50);

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 60,
                theme: 'grid',
                headStyles: { fillColor: [14, 165, 233] }
            });

            doc.save(`${fileName}.pdf`);
            
            // ALERTA DE ÉXITO
            toast.success(`PDF exportado: ${fileName}`);
        } catch (error) {
            toast.error('Ocurrió un error al generar el PDF');
            console.error(error);
        }
    };

    const exportToExcel = async () => {
        try {
            const fileNameDate = supplyFilterDate || "Historial_Completo";
            const fileName = `Inv_NovaSalud_${fileNameDate}.xlsx`;

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Inventario');

            // 1. Definir columnas y cabeceras
            worksheet.columns = [
                { header: 'Nombre del Producto', key: 'name', width: 35 },
                { header: 'Categoría', key: 'category', width: 20 },
                { header: 'Stock Actual', key: 'stock', width: 15 },
                { header: 'Precio Caja', key: 'pBox', width: 15 },
                { header: 'Precio Tab.', key: 'pTab', width: 15 },
                { header: 'Precio Uni.', key: 'pUni', width: 15 },
                { header: 'Vencimiento', key: 'date', width: 20 },
                { header: 'F. Abastecimiento', key: 'supplyDate', width: 20 },
            ];

            // 2. Agregar los datos
            filteredProducts.forEach(p => {
                worksheet.addRow({
                    name: p.name,
                    category: p.category,
                    stock: `${p.stock} ${p.unit.substring(0,3)}.`,
                    pBox: p.priceBox || 0,
                    pTab: p.priceTablet || 0,
                    pUni: p.priceUnit || 0,
                    date: p.expirationDate,
                    supplyDate: p.supplyDate || 'No registrada'
                });
            });

            // 3. DAR ESTILOS A LA CABECERA (Fila 1)
            const headerRow = worksheet.getRow(1);
            headerRow.eachCell((cell) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: '0EA5E9' }
                };
                cell.font = {
                    bold: true,
                    color: { argb: 'FFFFFF' },
                    size: 12
                };
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });

            // 4. DAR ESTILOS A LAS CELDAS DE DATOS Y ALINEACIÓN
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber > 1) {
                    row.eachCell((cell, colNumber) => {
                        cell.border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };

                        // ALINEACIÓN: Centrar todo excepto la primera columna (Nombre)
                        if (colNumber === 1) {
                            cell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
                        } else {
                            cell.alignment = { vertical: 'middle', horizontal: 'center' };
                        }
                    });
                }
            });

            // 5. Generar y descargar el archivo
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = fileName;
            anchor.click();
            window.URL.revokeObjectURL(url);

            toast.success(`Excel exportado: ${fileName}`);
        } catch (error) {
            toast.error('Error al generar el Excel con estilos');
            console.error(error);
        }
    };

    return {
        searchTerm, setSearchTerm, isModalOpen, setIsModalOpen,
        editingId, formData, errors, filteredProducts, supplyFilterDate, setSupplyFilterDate,
        handleInputChange, handleOpenCreate, handleOpenEdit, handleSubmit, handleDelete,
        exportToPDF, exportToExcel 
    };
};