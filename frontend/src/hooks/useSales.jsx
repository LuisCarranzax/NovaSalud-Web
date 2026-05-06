import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from 'exceljs';


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

    const exportSalesPDF = () => {
        try {
            const doc = new jsPDF();
            const fileNameDate = filterDate ? filterDate : "Historial_Completo";
            const fileName = `Ventas_NovaSalud_${fileNameDate}`;

            const tableColumn = ["ID Venta", "Producto", "Presentación", "Cantidad", "Fecha", "Método", "Monto Total"];
            const tableRows = [];

            filteredSales.forEach(s => {
                const saleData = [
                    s._id.substring(s._id.length - 6).toUpperCase(),
                    s.items.map(item => item.name || (item.productId && item.productId.name) || 'Desconocido').join(', '),
                    s.items.map(item => item.unit || 'Unidad').join(', '),
                    s.items.map(item => item.quantity).join(', '),
                    new Date(s.createdAt).toLocaleString(),
                    s.paymentMethod,
                    `S/ ${s.totalAmount.toFixed(2)}`
                ];
                tableRows.push(saleData);
            });

            doc.setFontSize(18);
            doc.text("Nova Salud - Reporte de Ventas", 14, 20);
            doc.setFontSize(11);
            doc.setTextColor(100);
            doc.text(`Reporte de ventas del ${filterDate}`, 14, 30);
            doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 14, 40);
            doc.text(`Total del periodo: S/ ${dailyTotal.toFixed(2)}`, 14, 50);

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 60,
                theme: 'grid',
                headStyles: { fillColor: [14, 165, 233] }
            });

            doc.save(`${fileName}.pdf`);
            
            toast.success(`PDF exportado: ${fileName}`);
        } catch (error) {
            toast.error('Ocurrió un error al generar el PDF');
            console.error(error);
        }
    };

    const exportSalesExcel = async () => {
        try {
            const nombreFecha = filterDate ? filterDate : "Historial_Completo";
            const nombreArchivo = `Ventas_NovaSalud_${nombreFecha}.xlsx`;

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Ventas');
            
            worksheet.columns = [
                { header: 'ID Venta', key: 'id', width: 15 },
                { header: 'Producto', key: 'product', width: 30 },
                { header: 'Presentación', key: 'presentation', width: 15 },
                { header: 'Cant.', key: 'quantity', width: 10 },
                { header: 'Fecha', key: 'date', width: 25 },
                { header: 'Método de Pago', key: 'method', width: 20 },
                { header: 'Total (S/)', key: 'total', width: 15 }
            ];

            filteredSales.forEach(s => {
                worksheet.addRow({
                    id: s._id.substring(s._id.length - 6).toUpperCase(),
                    product: s.items.map(item => item.name || (item.productId && item.productId.name) || 'Desconocido').join(', '),
                    presentation: s.items.map(item => item.unit || 'Unidad').join(', '),
                    quantity: s.items.map(item => item.quantity).join(', '),
                    date: new Date(s.createdAt).toLocaleString(),
                    method: s.paymentMethod,
                    total: s.totalAmount
                });
            });

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

            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber > 1) {
                    row.eachCell((cell) => {
                        cell.border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        cell.alignment = { vertical: 'middle', horizontal: 'center' };
                    });
                }
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = nombreArchivo;
            anchor.click();
            window.URL.revokeObjectURL(url);

            toast.success(`Excel exportado: ${nombreArchivo}`);
        } catch (error) {
            toast.error('Error al generar el Excel de ventas');
            console.error(error);
        }
    };


    return {
        filterDate, setFilterDate,
        searchTerm, setSearchTerm,
        filteredSales, dailyTotal, loading, exportSalesPDF, exportSalesExcel
    };
};