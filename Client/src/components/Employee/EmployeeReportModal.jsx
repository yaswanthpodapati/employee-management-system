import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { IoMdClose } from 'react-icons/io';
import PageTitle from '../UI/PageTitle';

function EmployeeReportModal({ show, onClose, employees }) {
  if (!show) return null;

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const logo = '/BookExpert.png';
    doc.addImage(logo, 'PNG', 10, 10, 40, 20);

    doc.setFontSize(18);
    doc.text('Employee Report', 80, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 35);

    const tableColumn = ["Sr No.", "Name", "Designation", "DOJ", "Salary", "Gender", "State"];
    const tableRows = employees.map((emp, index) => ([
      index + 1,
      emp.name,
      emp.designation,
      new Date(emp.dateOfJoin).toLocaleDateString(),
      emp.salary,
      emp.gender,
      emp.stateName,
    ]));

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 45,
      theme: 'striped',
      headStyles: { fillColor: [0, 123, 255] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 45 }
    });

    doc.save('Employee_Report.pdf');
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
      justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div style={{
        background: 'white', padding: '20px', borderRadius: '8px',
        width: '80%', height: '80%', overflowY: 'auto', position: 'relative'
      }}>
        <div style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }}
          onClick={onClose}>
          <IoMdClose size={24} />
        </div>

        <div style={{ textAlign: 'center' }}>
  <PageTitle title="Employee Report" />
</div>

        <div style={{ display: 'flex', justifyContent: 'right', gap: '20px' }}>
          <button
            onClick={handleDownloadPDF}
            style={{ backgroundColor: '#007bff', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px' }}
          >
            Download PDF
          </button>
        </div>

        <table border="1" cellPadding="5" style={{ width: '100%', textAlign: 'center', marginBottom: '20px' }}>
          <thead style={{ backgroundColor: '#007bff', color: 'white' }}>
            <tr>
              <th>Sr No.</th>
              <th>Name</th>
              <th>Designation</th>
              <th>DOJ</th>
              <th>Salary</th>
              <th>Gender</th>
              <th>State</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, index) => (
              <tr
                key={emp.employeeId}
                style={{ backgroundColor: index % 2 === 0 ? '#e6f2ff' : '#f9f9f9' }}
              >
                <td>{index + 1}</td>
                <td>{emp.name}</td>
                <td>{emp.designation}</td>
                <td>{new Date(emp.dateOfJoin).toLocaleDateString()}</td>
                <td>{emp.salary}</td>
                <td>{emp.gender}</td>
                <td>{emp.stateName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EmployeeReportModal;
