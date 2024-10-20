import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import patientService from '../../services/patientService';
import backgroundImage from '../../images/mediback.jpg';
import dischargeService from '../../services/dischargeService';

const PatientDischarge = ({ patientInfo }) => {
    const [formData, setFormData] = useState({ amountToPay: '', dischargeDate: '', notes: '' });
    const [patient, setPatient] = useState({ name: '', ID: '' });
    const navigate = useNavigate();
    const { patientId } = useParams();

    useEffect(() => {
        fetchPatient();
    }, []);

    const fetchPatient = async () => {
        if (patientInfo) {
            const patientData = await patientService.getPatientById(patientId);
            setPatient(patientData.name);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dischargeData = {
            ...formData,
            dischargeDate: new Date(formData.dischargeDate).toISOString(),
        };
        await dischargeService.createDischarge(dischargeData);
        navigate('/patients');
    };

    return (
        <div style={styles.backgroundImage}>
            <div style={styles.container}>
                <div style={styles.formContainer}>
                    <h1 style={styles.title}>Patient Checkout/Discharge</h1>
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <input
                            style={styles.input}
                            type="text"
                            name='patientId'
                            value={patientId}
                            onChange={handleInputChange}
                            placeholder="Patient ID"
                            required
                        />
                        <input
                            style={styles.input}
                            type="text"
                            name="name"
                            value={patient.name}
                            placeholder="Patient Name"
                            disabled
                        />
                        <input
                            style={styles.input}
                            type="number"
                            name="amountToPay"
                            value={formData.amountToPay}
                            onChange={handleInputChange}
                            placeholder="Amount to Pay"
                            required
                        />
                        <input
                            style={styles.input}
                            type="date"
                            name="dischargeDate"
                            value={formData.dischargeDate}
                            onChange={handleInputChange}
                            required
                        />
                        <textarea
                            style={styles.textarea}
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            placeholder="Discharge Notes"
                        />
                        <button style={styles.button} type="submit">
                            Discharge Patient
                        </button>
                    </form>
                </div>
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
    textarea: {
        margin: '10px 0',
        padding: '10px',
        fontSize: '16px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        minHeight: '100px',
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
    backgroundImage: {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        minHeight: '100vh',
    },
    formContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '30px',
    }
};

export default PatientDischarge;
