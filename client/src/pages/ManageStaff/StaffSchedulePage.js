  import React, { useState, useEffect } from 'react';
  import scheduleService from '../../services/scheduleService';
  import staffService from '../../services/staffService';

  const StaffSchedulePage = () => {
    const [schedules, setSchedules] = useState([]);
    const [staff, setStaff] = useState([]);
    const [formData, setFormData] = useState({
      staffId: '',
      date: '',
      shiftStart: '',
      shiftEnd: '',
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
      fetchSchedules();
      fetchStaff();
    }, []);

    const fetchSchedules = async () => {
      const data = await scheduleService.getAllSchedules();
      setSchedules(data);
    };

    const fetchStaff = async () => {
      const data = await staffService.getAllStaff();
      setStaff(data);
    };

    const handleInputChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (editingId) {
        await scheduleService.updateSchedule(editingId, formData);
        setEditingId(null);
      } else {
        await scheduleService.createSchedule(formData);
      }
      setFormData({ staffId: '', date: '', shiftStart: '', shiftEnd: '' });
      fetchSchedules();
    };

    const handleDelete = async (id) => {
      await scheduleService.deleteSchedule(id);
      fetchSchedules();
    };

    const handleEdit = (schedule) => {
      setFormData({
        staffId: schedule.staffId._id,
        date: new Date(schedule.date).toISOString().split('T')[0],
        shiftStart: schedule.shiftStart,
        shiftEnd: schedule.shiftEnd,
      });
      setEditingId(schedule._id);
    };

    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Staff Schedules</h1>

        <form onSubmit={handleSubmit} style={styles.form}>
          <select
            style={styles.select}
            name="staffId"
            value={formData.staffId}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Staff Member</option>
            {staff.map((member) => (
              <option key={member._id} value={member._id}>
                {member.name}
              </option>
            ))}
          </select>
          <input
            style={styles.input}
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
          <input
            style={styles.input}
            type="time"
            name="shiftStart"
            value={formData.shiftStart}
            onChange={handleInputChange}
            required
          />
          <input
            style={styles.input}
            type="time"
            name="shiftEnd"
            value={formData.shiftEnd}
            onChange={handleInputChange}
            required
          />
          <button style={styles.button} type="submit">
            {editingId ? 'Update Schedule' : 'Add Schedule'}
          </button>
        </form>

        <div style={styles.scheduleList}>
          <h2 style={styles.subtitle}>Schedule List</h2>
          {schedules.map((schedule) => (
            <div key={schedule._id} style={styles.scheduleCard}>
              <h3>{schedule.staffId.name}</h3>
              <p>Date: {new Date(schedule.date).toLocaleDateString()}</p>
              <p>Shift: {schedule.shiftStart} - {schedule.shiftEnd}</p>
              <div style={styles.cardActions}>
                <button style={styles.editButton} onClick={() => handleEdit(schedule)}>Edit</button>
                <button style={styles.deleteButton} onClick={() => handleDelete(schedule._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
    },
    title: {
      fontSize: '24px',
      marginBottom: '20px',
      color: '#333',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: '30px',
    },
    select: {
      margin: '10px 0',
      padding: '10px',
      fontSize: '16px',
      borderRadius: '4px',
      border: '1px solid #ddd',
    },
    input: {
      margin: '10px 0',
      padding: '10px',
      fontSize: '16px',
      borderRadius: '4px',
      border: '1px solid #ddd',
    },
    button: {
      backgroundColor: '#4CAF50',
      color: 'white',
      padding: '10px',
      fontSize: '16px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    scheduleList: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '20px',
    },
    subtitle: {
      fontSize: '20px',
      marginBottom: '15px',
      gridColumn: '1 / -1',
    },
    scheduleCard: {
      backgroundColor: '#f9f9f9',
      padding: '15px',
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    cardActions: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '10px',
    },
    editButton: {
      backgroundColor: '#2196F3',
      color: 'white',
      padding: '5px 10px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    deleteButton: {
      backgroundColor: '#f44336',
      color: 'white',
      padding: '5px 10px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
  };

  export default StaffSchedulePage;