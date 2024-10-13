  import React, { useState, useEffect } from 'react';
  import wardService from '../../services/wardService';

  const WardManagePage = () => {
    const [wards, setWards] = useState([]);
    const [selectedWard, setSelectedWard] = useState(null);
    const [hoveredBed, setHoveredBed] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedBed, setSelectedBed] = useState(null);
    const [patientId, setPatientId] = useState('');
    const [dialogAction, setDialogAction] = useState('');

    useEffect(() => {
      fetchWards();
    }, []);

    const fetchWards = async () => {
      const data = await wardService.getAllWards();
      setWards(data);
    };

    const handleWardSelect = async (wardNo) => {
      const ward = await wardService.getWardById(wardNo);
      setSelectedWard(ward);
    };

    const handleBedClick = (bed) => {
      setSelectedBed(bed);
      if (bed.isOccupied) {
        setDialogAction('remove');
        setPatientId(bed.patientId);
      } else {
        setDialogAction('add');
        setPatientId('');
      }
      setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
      setIsDialogOpen(false);
      setSelectedBed(null);
      setPatientId('');
    };

    const handlePatientAction = async () => {
      if (selectedBed) {
        const updatedBed = { 
          ...selectedBed, 
          isOccupied: dialogAction === 'add',
          patientId: dialogAction === 'add' ? patientId : null
        };
        await wardService.updateBedOccupancy(selectedWard.wardNo, selectedBed.bedNo, updatedBed.isOccupied, updatedBed.patientId);
        setSelectedWard({
          ...selectedWard,
          beds: selectedWard.beds.map(b => b.bedNo === selectedBed.bedNo ? updatedBed : b)
        });
      }
      handleDialogClose();
    };

    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Ward Management</h1>
      
        <div style={styles.wardSelector}>
          <select onChange={(e) => handleWardSelect(e.target.value)} style={styles.select}>
            <option value="">Select Ward</option>
            {wards.map(ward => (
              <option key={ward.wardNo} value={ward.wardNo}>
                {ward.wardNo} - {ward.wardType}
              </option>
            ))}
          </select>
        </div>

        {selectedWard && (
          <div style={styles.wardLayout}>
            <h2>{selectedWard.wardNo} - {selectedWard.wardType}</h2>
            <div style={styles.bedGrid}>
              {selectedWard.beds.map(bed => (
                <div
                  key={bed.bedNo}
                  style={{
                    ...styles.bed,
                    backgroundColor: bed.isOccupied ? '#e74c3c' : '#2ecc71',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleBedClick(bed)}
                  onMouseEnter={() => setHoveredBed(bed)}
                  onMouseLeave={() => setHoveredBed(null)}
                >
                  {bed.bedNo}
                </div>
              ))}
            </div>
            {hoveredBed && (
              <div style={styles.bedInfo}>
                <p>Bed No: {hoveredBed.bedNo}</p>
                <p>Status: {hoveredBed.isOccupied ? 'Occupied' : 'Available'}</p>
                {hoveredBed.isOccupied && <p>Patient ID: {hoveredBed.patientId}</p>}
              </div>
            )}
          </div>
        )}
      
        {isDialogOpen && (
          <div style={styles.dialogOverlay}>
            <div style={styles.dialogContent}>
              <h3>{dialogAction === 'add' ? 'Add Patient' : 'Remove Patient'}</h3>
              {dialogAction === 'add' ? (
                <input
                  type="text"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  placeholder="Enter Patient ID"
                  style={styles.input}
                />
              ) : (
                <p>Are you sure you want to remove patient {patientId}?</p>
              )}
              <div style={styles.dialogActions}>
                <button onClick={handlePatientAction} style={styles.button}>
                  {dialogAction === 'add' ? 'Add' : 'Remove'}
                </button>
                <button onClick={handleDialogClose} style={styles.button}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const styles = {
    container: {
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '20px',
    },
    title: {
      fontSize: '28px',
      marginBottom: '20px',
      color: '#2c3e50',
      textAlign: 'center',
    },
    wardSelector: {
      marginBottom: '20px',
    },
    select: {
      width: '100%',
      padding: '10px',
      fontSize: '16px',
      borderRadius: '4px',
    },
    wardLayout: {
      backgroundColor: '#ecf0f1',
      padding: '20px',
      borderRadius: '8px',
    },
    bedGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
      gap: '10px',
      marginTop: '20px',
    },
    bed: {
      width: '60px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '4px',
      color: 'white',
      fontWeight: 'bold',
      transition: 'transform 0.3s ease',
      ':hover': {
        transform: 'scale(1.1)',
      },
    },
    bedInfo: {
      marginTop: '20px',
      padding: '10px',
      backgroundColor: '#3498db',
      color: 'white',
      borderRadius: '4px',
    },
    dialogOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    dialogContent: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      width: '300px',
    },
    dialogActions: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '20px',
    },
    input: {
      width: '100%',
      padding: '10px',
      marginTop: '10px',
      borderRadius: '4px',
      border: '1px solid #ddd',
    },
  };

  export default WardManagePage;