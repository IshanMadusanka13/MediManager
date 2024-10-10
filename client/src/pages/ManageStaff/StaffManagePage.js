  import React, { useState, useEffect } from 'react';
  import staffService from '../../services/staffService';

  const StaffManagePage = () => {
    const [staff, setStaff] = useState([]);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', role: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
      fetchStaff();
    }, []);

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
        await staffService.updateStaff(editingId, formData);
      } else {
        await staffService.createStaff(formData);
      }
      setFormData({ name: '', email: '', phone: '', role: '' });
      setEditingId(null);
      fetchStaff();
    };

    const handleEdit = (staffMember) => {
      setFormData(staffMember);
      setEditingId(staffMember._id);
    };

    const handleDelete = async (id) => {
      await staffService.deleteStaff(id);
      fetchStaff();
    };

    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Manage Staff</h1>
      
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Name"
            required
          />
          <input
            style={styles.input}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            required
          />
          <input
            style={styles.input}
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Phone"
            required
          />
          <input
            style={styles.input}
            type="text"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            placeholder="Role"
            required
          />
          <button style={styles.button} type="submit">
            {editingId ? 'Update Staff' : 'Add Staff'}
          </button>
        </form>

        <div style={styles.staffList}>
          <h2 style={styles.subtitle}>Staff List</h2>
          {staff.map((staffMember) => (
            <div key={staffMember._id} style={styles.staffCard}>
              <h3>{staffMember.name}</h3>
              <p>{staffMember.email}</p>
              <p>{staffMember.phone}</p>
              <p>{staffMember.role}</p>
              <div style={styles.cardActions}>
                <button style={styles.editButton} onClick={() => handleEdit(staffMember)}>Edit</button>
                <button style={styles.deleteButton} onClick={() => handleDelete(staffMember._id)}>Delete</button>
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
    staffList: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '20px',
    },
    subtitle: {
      fontSize: '20px',
      marginBottom: '15px',
      gridColumn: '1 / -1',
    },
    staffCard: {
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

  export default StaffManagePage;
