// Generador de PDF para reportes

async function generateReport() {
    const period = document.getElementById('report-period').value;
    
    try {
        // Obtener todos los pedidos
        const { data: orders, error } = await supabase
            .from('pedidos_t_nuria')
            .select('*')
            .order('fecha', { ascending: false });

        if (error) throw error;

        // Filtrar por período
        const now = new Date();
        let startDate = new Date();
        
        if (period === 'week') {
            startDate.setDate(now.getDate() - 7);
        } else if (period === 'month') {
            startDate.setMonth(now.getMonth() - 1);
        } else {
            startDate.setFullYear(now.getFullYear() - 1);
        }

        const filteredOrders = orders.filter(order => 
            new Date(order.fecha) >= startDate
        );

        // Calcular estadísticas
        const totalSales = filteredOrders.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = filteredOrders.length;
        const averageOrder = totalOrders > 0 ? totalSales / totalOrders : 0;

        // Obtener detalles de pedidos para productos más vendidos
        const { data: detalles } = await supabase
            .from('detalle_pedido_t_nuria')
            .select('*')
            .in('pedido_id', filteredOrders.map(o => o.id));

        // Calcular productos más vendidos
        const productMap = new Map();
        if (detalles) {
            detalles.forEach(detalle => {
                if (productMap.has(detalle.producto)) {
                    const existing = productMap.get(detalle.producto);
                    productMap.set(detalle.producto, {
                        nombre: detalle.producto,
                        cantidad: existing.cantidad + detalle.cantidad,
                        total: existing.total + (detalle.precio * detalle.cantidad)
                    });
                } else {
                    productMap.set(detalle.producto, {
                        nombre: detalle.producto,
                        cantidad: detalle.cantidad,
                        total: detalle.precio * detalle.cantidad
                    });
                }
            });
        }

        const topProducts = Array.from(productMap.values())
            .sort((a, b) => b.total - a.total)
            .slice(0, 5);

        // Generar PDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Header
        doc.setFillColor(188, 96, 113);
        doc.rect(0, 0, 210, 40, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.text('Tentación de Nuria', 105, 20, { align: 'center' });
        
        doc.setFontSize(16);
        doc.text('Reporte de Ventas', 105, 32, { align: 'center' });
        
        // Información del reporte
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        const periodText = period === 'week' ? 'Última Semana' : 
                          period === 'month' ? 'Último Mes' : 'Último Año';
        doc.text(`Período: ${periodText}`, 20, 55);
        doc.text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`, 20, 62);
        
        // Resumen de ventas
        doc.setFontSize(14);
        doc.setTextColor(188, 96, 113);
        doc.text('Resumen de Ventas', 20, 75);
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.text(`Total de Ventas: Bs. ${totalSales.toFixed(2)}`, 20, 85);
        doc.text(`Total de Pedidos: ${totalOrders}`, 20, 92);
        doc.text(`Promedio por Pedido: Bs. ${averageOrder.toFixed(2)}`, 20, 99);
        
        // Productos más vendidos
        if (topProducts.length > 0) {
            doc.setFontSize(14);
            doc.setTextColor(188, 96, 113);
            doc.text('Productos Más Vendidos', 20, 115);
            
            const topProductsData = topProducts.map((product, index) => [
                index + 1,
                product.nombre,
                product.cantidad,
                `Bs. ${product.total.toFixed(2)}`
            ]);
            
            doc.autoTable({
                startY: 120,
                head: [['#', 'Producto', 'Cantidad', 'Total']],
                body: topProductsData,
                theme: 'grid',
                headStyles: { fillColor: [188, 96, 113], textColor: 255 },
                styles: { fontSize: 10 },
                margin: { left: 20, right: 20 }
            });
        }
        
        // Detalle de pedidos
        if (filteredOrders.length > 0) {
            const finalY = doc.lastAutoTable?.finalY || 160;
            
            doc.setFontSize(14);
            doc.setTextColor(188, 96, 113);
            doc.text('Detalle de Pedidos', 20, finalY + 15);
            
            const ordersData = filteredOrders.slice(0, 10).map(order => [
                order.id,
                order.nombre,
                new Date(order.fecha).toLocaleDateString('es-ES'),
                order.metodo_pago,
                `Bs. ${order.total.toFixed(2)}`
            ]);
            
            doc.autoTable({
                startY: finalY + 20,
                head: [['ID', 'Cliente', 'Fecha', 'Método de Pago', 'Total']],
                body: ordersData,
                theme: 'grid',
                headStyles: { fillColor: [188, 96, 113], textColor: 255 },
                styles: { fontSize: 9 },
                margin: { left: 20, right: 20 }
            });
        }
        
        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(128);
            doc.text(
                `Página ${i} de ${pageCount}`,
                105,
                doc.internal.pageSize.height - 10,
                { align: 'center' }
            );
        }
        
        // Descargar el PDF
        doc.save(`Reporte_Ventas_${periodText}_${Date.now()}.pdf`);
        showToast('Reporte generado exitosamente', 'success');
    } catch (error) {
        console.error('Error generando reporte:', error);
        showToast('Error al generar reporte', 'error');
    }
}
