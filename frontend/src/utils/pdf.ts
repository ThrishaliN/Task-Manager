import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Task } from '../types';
import { format } from 'date-fns';

export const generateTasksPDF = (tasks: Task[], title = 'Task Report') => {
  // Create new PDF document
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  
  // Add timestamp
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated on: ${format(new Date(), 'PPpp')}`, 14, 30);
  
  // Map tasks to table format
  const tableBody = tasks.map((task) => [
    task.title,
    task.assignedTo,
    format(new Date(task.deadline), 'PP'),
    getStatusLabel(task.status),
  ]);
  
  // Generate table
  autoTable(doc, {
    head: [['Task', 'Assigned To', 'Deadline', 'Status']],
    body: tableBody,
    startY: 40,
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { 
      fillColor: [59, 130, 246], // primary-600
      textColor: 255,
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 40 },
      2: { cellWidth: 35 },
      3: { cellWidth: 30 },
    },
    alternateRowStyles: { fillColor: [240, 246, 255] }, // primary-50
    didDrawPage: (data) => {
      // Add page number at the bottom
      doc.setFontSize(10);
      doc.text(
        `Page ${doc.getNumberOfPages()}`,
        data.settings.margin.left,
        doc.internal.pageSize.height - 10
      );
    },
  });
  
  // Save the PDF
  doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};

// Helper to get status label with proper casing
const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'in-progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
};