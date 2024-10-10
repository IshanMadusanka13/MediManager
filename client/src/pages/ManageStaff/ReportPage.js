  import React, { useState } from 'react';
  import { FaFileDownload, FaUserMd, FaCalendarAlt } from 'react-icons/fa';
  import jsPDF from 'jspdf';
  import 'jspdf-autotable';
  import staffService from '../../services/staffService';
  import scheduleService from '../../services/scheduleService';
  //import logo from '../../assets/hospital_logo.png';

  const ReportPage = () => {
    const [staffReport, setStaffReport] = useState([]);
    const [scheduleReport, setScheduleReport] = useState([]);
    const [loading, setLoading] = useState(false);

    const generateStaffReport = async () => {
      setLoading(true);
      try {
        const data = await staffService.getAllStaff();
        setStaffReport(data);
        
      } catch (error) {
        console.error('Error generating staff report', error);
      } finally {
        setLoading(false);
      }
    };

    const generateScheduleReport = async () => {
      setLoading(true);
      try {
        const schedules = await scheduleService.getAllSchedules();
        const detailedSchedules = schedules.map(schedule => ({
          ...schedule,
          staffName: schedule.staffId.name,
          staffEmail: schedule.staffId.email,
          staffPhone: schedule.staffId.phone,
          staffRole: schedule.staffId.role,
          staffId: schedule.staffId._id
        }));
        setScheduleReport(detailedSchedules);
        console.log('Schedule Data:', detailedSchedules); 
      } catch (error) {
        console.error('Error generating schedule report', error);
      } finally {
        setLoading(false);
      }
    };

    const downloadPDF = (reportType) => {
      const doc = new jsPDF();
    
      // Add hospital logo at the top
      //const imgData = logo; // Ensure logo is a valid base64 or URL
      //doc.addImage(imgData, 'PNG', 14, 10, 30, 30);
    
      // Add report title with custom font and size
      doc.setFontSize(20);
      doc.setTextColor('#4CAF50'); // Hospital green color
      const title = reportType === 'staff' ? 'Staff Report' : 'Schedule Report';
      doc.text(title, 14, 50);
    
      // Add a date and time for when the report was generated
      const date = new Date().toLocaleString();
      doc.setFontSize(12);
      doc.setTextColor('#666666');
      doc.text(`Generated on: ${date}`, 14, 60);
    
      // Define table content
      if (reportType === 'staff') {
        doc.autoTable({
          head: [['Name', 'Email', 'Phone', 'Role']],
          body: staffReport.map(staff => [staff.name, staff.email, staff.phone, staff.role]),
          startY: 70,
          theme: 'grid',
          styles: { fillColor: [224, 235, 255], textColor: '#333' }, // Light blue rows
          alternateRowStyles: { fillColor: [240, 248, 255] }, // Lighter alternate rows
          headStyles: { fillColor: '#4CAF50', textColor: '#fff' }, // Green header
          margin: { top: 70 },
        });
      } else {
        doc.autoTable({
          head: [['Staff Name', 'Email', 'Phone', 'Role', 'Date', 'Shift Start', 'Shift End']],
          body: scheduleReport.map(schedule => [
            schedule.staffName,
            schedule.staffEmail,
            schedule.staffPhone,
            schedule.staffRole,
            new Date(schedule.date).toLocaleDateString(),
            schedule.shiftStart,
            schedule.shiftEnd
          ]),
          startY: 70,
          theme: 'grid',
          styles: { fillColor: [224, 235, 255], textColor: '#333' },
          alternateRowStyles: { fillColor: [240, 248, 255] },
          headStyles: { fillColor: '#4CAF50', textColor: '#fff' },
          margin: { top: 70 },
        });
      }
    
      // Add page numbers at the bottom
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(`Page ${i} of ${totalPages}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10, { align: 'right' });
      }
    
      // Save the PDF with a unique file name
      doc.save(`${reportType}_report_${new Date().getTime()}.pdf`);
    };

    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Reports Dashboard</h1>
      
        <div style={styles.cardContainer}>
          <ReportCard
            title="Staff Report"
            icon={<FaUserMd style={styles.cardIcon} />}
            onGenerate={generateStaffReport}
            onDownload={() => downloadPDF('staff')}
            disabled={loading || !staffReport}
          />
          <ReportCard
            title="Schedule Report"
            icon={<FaCalendarAlt style={styles.cardIcon} />}
            onGenerate={generateScheduleReport}
            onDownload={() => downloadPDF('schedule')}
            disabled={loading || !scheduleReport}
          />
        </div>

        {loading && <p style={styles.loading}>Generating report...</p>}

        {staffReport.length > 0 && (
          <ReportTable
            title="Staff Report"
            headers={['Name', 'Email', 'Phone', 'Role']}
            data={staffReport.map(staff => [staff.name, staff.email, staff.phone, staff.role])}
          />
        )}

        {scheduleReport.length > 0 && (
          <ReportTable
            title="Schedule Report"
            headers={['Staff Name', 'Email', 'Phone', 'Role', 'Date', 'Shift Start', 'Shift End']}
            data={scheduleReport.map(schedule => [
              schedule.staffName,
              schedule.staffEmail,
              schedule.staffPhone,
              schedule.staffRole,
              new Date(schedule.date).toLocaleDateString(),
              schedule.shiftStart,
              schedule.shiftEnd
            ])}
          />
        )}
      </div>
    );
  };

  const ReportCard = ({ title, icon, onGenerate, onDownload, disabled }) => (
    <div style={styles.card}>
      {icon}
      <h2 style={styles.cardTitle}>{title}</h2>
      <button onClick={onGenerate} style={styles.button} disabled={disabled}>
        Generate Report
      </button>
      <button onClick={onDownload} style={styles.downloadButton} disabled={disabled}>
        <FaFileDownload /> Download PDF
      </button>
    </div>
  );

  const ReportTable = ({ title, headers, data }) => (
    <div style={styles.tableContainer}>
      <h2 style={styles.subtitle}>{title}</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index} style={styles.th}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} style={styles.td}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    title: {
      fontSize: '28px',
      marginBottom: '20px',
      color: '#333',
      textAlign: 'center',
    },
    cardContainer: {
      display: 'flex',
      justifyContent: 'space-around',
      marginBottom: '30px',
    },
    card: {
      background: 'white',
      borderRadius: '8px',
      padding: '20px',
      width: '45%',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    cardIcon: {
      fontSize: '48px',
      color: '#4CAF50',
      marginBottom: '10px',
    },
    cardTitle: {
      fontSize: '20px',
      marginBottom: '15px',
      color: '#333',
    },
    button: {
      backgroundColor: '#4CAF50',
      color: 'white',
      padding: '10px 15px',
      fontSize: '16px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginBottom: '10px',
    },
    downloadButton: {
      backgroundColor: '#2196F3',
      color: 'white',
      padding: '10px 15px',
      fontSize: '16px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
    },
    loading: {
      textAlign: 'center',
      fontSize: '18px',
      color: '#666',
    },
    tableContainer: {
      marginTop: '30px',
      overflowX: 'auto',
    },
    subtitle: {
      fontSize: '24px',
      marginBottom: '15px',
      color: '#333',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '10px',
    },
    th: {
      backgroundColor: '#f2f2f2',
      padding: '12px',
      textAlign: 'left',
      borderBottom: '2px solid #ddd',
      fontWeight: 'bold',
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #ddd',
    },
  };

  export default ReportPage;
