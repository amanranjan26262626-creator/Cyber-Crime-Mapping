import jsPDF from 'jspdf';
import 'jspdf-autotable';

const REPORTS_KEY = 'cyberlens_reports';

export const saveReport = (type, query, data) => {
    try {
        const newReport = {
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            type,
            query,
            data
        };

        const existing = JSON.parse(localStorage.getItem(REPORTS_KEY) || '[]');
        const updated = [newReport, ...existing]; // Newest first
        localStorage.setItem(REPORTS_KEY, JSON.stringify(updated));

        console.log("Report Saved:", newReport);
        return newReport;
    } catch (error) {
        console.error("Failed to save report:", error);
    }
};

export const getReports = () => {
    try {
        return JSON.parse(localStorage.getItem(REPORTS_KEY) || '[]');
    } catch (e) {
        console.error("Corrupt Reports Data", e);
        return [];
    }
};

export const clearReports = () => {
    localStorage.removeItem(REPORTS_KEY);
};

export const generateReportPDF = (report) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const today = new Date().toLocaleString();

    // -- Header --
    doc.setFillColor(15, 23, 42); // Dark Blue Header
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text("Cyberlens Intelligence", 15, 20);

    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184);
    doc.text("CONFIDENTIAL INVESTIGATION REPORT", 15, 30);
    doc.text(`Generated: ${today}`, pageWidth - 15, 30, { align: 'right' });

    // -- Watermark --
    doc.setTextColor(240, 240, 240);
    doc.setFontSize(60);
    doc.saveGraphicsState();
    doc.setGState(new doc.GState({ opacity: 0.1 }));
    doc.text("CYBERLENS", 40, 150, { angle: 45 });
    doc.restoreGraphicsState();

    // -- Meta Info --
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Report Type: ${report.type}`, 15, 55);
    doc.text(`Target Query: ${report.query}`, 15, 62);
    doc.text(`Reference ID: ${report.id.split('-')[0]}`, 15, 69);

    let startY = 80;

    // Helper to add Title
    const addTitle = (text, y) => {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 58, 138);
        doc.text(text, 15, y);
        return y + 8;
    };

    // -- Report Content Logic --

    // Handle "Intel Search" specifically for nested API data
    if (report.type === 'Intel Search' && report.data?.List) {
        const sources = report.data.List;

        Object.keys(sources).forEach((sourceName) => {
            const sourceData = sources[sourceName];

            // 1. Source Title (e.g., GamingMonk)
            if (startY > 270) { doc.addPage(); startY = 20; }
            startY = addTitle(`${sourceName} Database Hit`, startY);

            // 2. Info Leak Description (if exists)
            if (sourceData.InfoLeak) {
                doc.setFontSize(9);
                doc.setFont('helvetica', 'italic');
                doc.setTextColor(80);
                const descLines = doc.splitTextToSize(sourceData.InfoLeak, pageWidth - 30);
                doc.text(descLines, 15, startY);
                startY += (descLines.length * 5) + 5;
            }

            // 3. Data Tables
            if (sourceData.Data && Array.isArray(sourceData.Data)) {
                sourceData.Data.forEach((record, idx) => {
                    const tableBody = Object.entries(record).map(([k, v]) => {
                        // Clean up keys and values
                        let cleanKey = k.replace(/([A-Z])/g, ' $1').trim(); // CamelCase to Space
                        let cleanVal = String(v).replace(/\n/g, ', '); // Remove newlines

                        // Special Handling for Address
                        if (k.includes('Address')) cleanVal = String(v).replace(/\n/g, ' ').replace(/\s+/g, ' ');

                        return [cleanKey, cleanVal];
                    });

                    doc.autoTable({
                        startY: startY,
                        head: [[`Record #${idx + 1} Details`, 'Value']],
                        body: tableBody,
                        theme: 'grid',
                        headStyles: { fillColor: [59, 130, 246] }, // Blue Header
                        columnStyles: {
                            0: { fontStyle: 'bold', width: 50 },
                            1: { width: 120 }
                        },
                        didDrawPage: (d) => { startY = d.cursor.y + 10; }
                    });

                    // Update startY after table
                    startY = doc.lastAutoTable.finalY + 10;
                });
            } else {
                startY += 10;
            }
        });

        // Summary Statistics
        if (startY > 250) { doc.addPage(); startY = 20; }
        doc.autoTable({
            startY: startY,
            head: [['Search Summary', '']],
            body: [
                ['Total Databases Found', report.data.NumOfDatabase],
                ['Total Records', report.data.NumOfResults],
                ['Search Duration', `${report.data['search time']}s`]
            ],
            theme: 'plain',
            styles: { fontSize: 10, fontStyle: 'bold' }
        });

    }
    // Fallback for other types
    else if (report.type === 'Telegram Analysis') {
        // ... (Keep existing Telegram logic if needed, or better general handler)
        const stats = report.data || {};
        const kv = Object.entries(stats).map(([k, v]) => [
            k.replace(/_/g, ' ').toUpperCase(),
            typeof v === 'object' ? JSON.stringify(v) : v.toString()
        ]);

        doc.autoTable({
            startY: startY,
            head: [['Metric', 'Value']],
            body: kv,
            theme: 'striped',
            headStyles: { fillColor: [16, 185, 129] }
        });
    }
    else {
        // Raw Fallback
        doc.setFontSize(10);
        const jsonStr = JSON.stringify(report.data, null, 2);
        const lines = doc.splitTextToSize(jsonStr, pageWidth - 30);
        doc.text(lines, 15, startY);
    }

    // -- Footer --
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text('Cyberlens Intelligence System - Internal Use Only', pageWidth / 2, 290, { align: 'center' });
    }

    doc.save(`Cyberlens_Report_${report.type.replace(/\s/g, '_')}_${Date.now()}.pdf`);
};
