
import React, { useState, useEffect } from 'react';
import appointmentService from '../../services/appointmentService';

const MakeAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({ date: '', time: '', doctor: '', patient: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const data = await appointmentService.getAllAppointments();
    setAppointments(data);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
    const handleSubmit = async (e) => {
      e.preventDefault();
      const appointmentData = {
        ...formData,
        date: new Date(formData.date).toISOString(),
        time: new Date(`1970-01-01T${formData.time}`).toISOString()
      };
      if (editingId) {
        await appointmentService.updateAppointment(editingId, appointmentData);
      } else {
        await appointmentService.createAppointment(appointmentData);
      }
      setFormData({ date: '', time: '', doctor: '', patient: '' });
      setEditingId(null);
      fetchAppointments();
    };
  const handleEdit = (appointment) => {
    setFormData(appointment);
    setEditingId(appointment._id);
  };

  const handleDelete = async (id) => {
    await appointmentService.deleteAppointment(id);
    fetchAppointments();
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Manage Appointments</h1>
      
      <form onSubmit={handleSubmit} style={styles.form}>
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
          name="time"
          value={formData.time}
          onChange={handleInputChange}
          required
        />
        <input
          style={styles.input}
          type="text"
          name="doctor"
          value={formData.doctor}
          onChange={handleInputChange}
          placeholder="Doctor"
          required
        />
        <input
          style={styles.input}
          type="text"
          name="patient"
          value={formData.patient}
          onChange={handleInputChange}
          placeholder="Patient"
          required
        />
        <button style={styles.button} type="submit">
          {editingId ? 'Update Appointment' : 'Add Appointment'}
        </button>
      </form>

      <div style={styles.appointmentList}>
        <h2 style={styles.subtitle}>Appointment List</h2>
        {appointments.map((appointment) => (
          <div key={appointment._id} style={styles.appointmentCard}>
            <p>Date: {new Date(appointment.date).toLocaleDateString()}</p>
            <p>Time: {new Date(appointment.time).toLocaleTimeString()}</p>
            <p>Doctor: {appointment.doctor}</p>
            <p>Patient: {appointment.patient}</p>
            <div style={styles.cardActions}>
              <button style={styles.editButton} onClick={() => handleEdit(appointment)}>Edit</button>
              <button style={styles.deleteButton} onClick={() => handleDelete(appointment._id)}>Delete</button>
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
  appointmentList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  subtitle: {
    fontSize: '20px',
    marginBottom: '15px',
    gridColumn: '1 / -1',
  },
  appointmentCard: {
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

export default MakeAppointment;
