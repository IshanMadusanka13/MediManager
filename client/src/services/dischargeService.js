import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const createDischarge = async (dischargeData) => {
    const response = await axios.post(`${API_URL}/discharges`, dischargeData);
    return response.data;
};

const getDischargeByPatientId = async (patientId) => {
    const response = await axios.get(`${API_URL}/discharges/${patientId}`);
    return response.data;
};

const dischargeService = {
    createDischarge,
    getDischargeByPatientId,
};

export default dischargeService;
