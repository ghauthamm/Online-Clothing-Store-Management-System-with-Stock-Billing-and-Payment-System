// Invoice Generation Utility using jsPDF
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { shopDetails } from '../context/ShopContext';

export const generateInvoicePDF = (bill) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Colors
    const primaryColor = [139, 69, 19]; // Brown
    const secondaryColor = [210, 105, 30]; // Chocolate

    // Header Background
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 45, 'F');

    // Shop Name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(shopDetails.name, pageWidth / 2, 18, { align: 'center' });

    // Shop Tagline
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(shopDetails.tagline, pageWidth / 2, 26, { align: 'center' });

    // Shop Contact
    doc.setFontSize(9);
    doc.text(`${shopDetails.address} | Phone: ${shopDetails.phone}`, pageWidth / 2, 34, { align: 'center' });
    doc.text(`GST: ${shopDetails.gst}`, pageWidth / 2, 40, { align: 'center' });

    // Invoice Title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('TAX INVOICE', pageWidth / 2, 55, { align: 'center' });

    // Invoice Details Box
    doc.setDrawColor(...secondaryColor);
    doc.setLineWidth(0.5);
    doc.rect(14, 60, pageWidth - 28, 30);

    // Left side - Invoice details
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Bill No: ${bill.billNo}`, 18, 68);
    doc.text(`Order ID: ${bill.orderId}`, 18, 75);
    doc.text(`Date: ${new Date(bill.createdAt).toLocaleDateString('en-IN')}`, 18, 82);

    // Right side - Customer details
    doc.text(`Customer: ${bill.customerName}`, pageWidth / 2 + 10, 68);
    doc.text(`Phone: ${bill.customerPhone || 'N/A'}`, pageWidth / 2 + 10, 75);

    // Address (may need wrapping)
    const addressLines = doc.splitTextToSize(`Address: ${typeof bill.customerAddress === 'object'
        ? `${bill.customerAddress.street}, ${bill.customerAddress.city}, ${bill.customerAddress.state} - ${bill.customerAddress.pincode}`
        : bill.customerAddress}`, 80);
    doc.text(addressLines, pageWidth / 2 + 10, 82);

    // Items Table
    const tableColumn = ['#', 'Item', 'Size', 'Price', 'Qty', 'Discount', 'Total'];
    const tableRows = bill.items.map((item, index) => {
        const price = item.price;
        const discount = item.discount || 0;
        const discountedPrice = price - (price * discount / 100);
        const total = discountedPrice * item.quantity;

        return [
            index + 1,
            item.name,
            item.size,
            `₹${price.toFixed(2)}`,
            item.quantity,
            discount > 0 ? `${discount}%` : '-',
            `₹${total.toFixed(2)}`
        ];
    });

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 95,
        theme: 'grid',
        headStyles: {
            fillColor: primaryColor,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            halign: 'center'
        },
        bodyStyles: {
            halign: 'center'
        },
        columnStyles: {
            0: { cellWidth: 10 },
            1: { cellWidth: 50, halign: 'left' },
            2: { cellWidth: 20 },
            3: { cellWidth: 25 },
            4: { cellWidth: 15 },
            5: { cellWidth: 25 },
            6: { cellWidth: 30 }
        }
    });

    // Summary Section
    const finalY = doc.lastAutoTable.finalY + 10;

    // Summary Box
    doc.setFillColor(245, 245, 245);
    doc.rect(pageWidth - 90, finalY, 76, 45, 'F');
    doc.setDrawColor(...secondaryColor);
    doc.rect(pageWidth - 90, finalY, 76, 45);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    // Summary items
    doc.text('Subtotal:', pageWidth - 86, finalY + 10);
    doc.text(`₹${bill.subtotal.toFixed(2)}`, pageWidth - 20, finalY + 10, { align: 'right' });

    doc.text('Discount:', pageWidth - 86, finalY + 18);
    doc.text(`-₹${bill.discount.toFixed(2)}`, pageWidth - 20, finalY + 18, { align: 'right' });

    doc.text('GST (5%):', pageWidth - 86, finalY + 26);
    doc.text(`₹${bill.tax.toFixed(2)}`, pageWidth - 20, finalY + 26, { align: 'right' });

    // Grand Total
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setFillColor(...primaryColor);
    doc.rect(pageWidth - 90, finalY + 30, 76, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('Grand Total:', pageWidth - 86, finalY + 38);
    doc.text(`₹${bill.grandTotal.toFixed(2)}`, pageWidth - 20, finalY + 38, { align: 'right' });

    // Payment Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Payment Method: ${bill.paymentMethod}`, 14, finalY + 10);
    doc.text(`Payment Status: ${bill.paymentStatus}`, 14, finalY + 18);

    // Status Badge
    const statusColor = bill.paymentStatus === 'Paid' ? [34, 139, 34] : [255, 140, 0];
    doc.setFillColor(...statusColor);
    doc.roundedRect(14, finalY + 22, 40, 10, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text(bill.paymentStatus.toUpperCase(), 34, finalY + 29, { align: 'center' });

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 30;

    doc.setDrawColor(...secondaryColor);
    doc.setLineWidth(0.5);
    doc.line(14, footerY - 5, pageWidth - 14, footerY - 5);

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Thank you for shopping with us!', pageWidth / 2, footerY, { align: 'center' });
    doc.text('For any queries, please contact us at the above number.', pageWidth / 2, footerY + 6, { align: 'center' });
    doc.text('This is a computer generated invoice.', pageWidth / 2, footerY + 12, { align: 'center' });

    return doc;
};

export const downloadInvoice = (bill) => {
    const doc = generateInvoicePDF(bill);
    doc.save(`Invoice_${bill.billNo}.pdf`);
};

export const printInvoice = (bill) => {
    const doc = generateInvoicePDF(bill);
    doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank');
};
