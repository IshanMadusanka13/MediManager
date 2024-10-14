import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader'; // Correct import
import axios from 'axios';
import './ScanningCard.css';

const ScanningCard = () => {
	const [scanning, setScanning] = useState(false);
	const [qrKey, setQrKey] = useState('');
	const [patientData, setPatientData] = useState(null);
	const [error, setError] = useState('');

	const handleScan = (result, error) => {
		if (!!result) {
			setQrKey(result?.text); // Adjust for newer API response
			fetchPatientData(result?.text); // Fetch patient data using scanned QR key
			setScanning(false);
		}

		if (!!error) {
			console.error(error);
			setError('Error scanning QR code');
		}
	};

	const fetchPatientData = async (qrKey) => {
		try {
			const response = await axios.get(`http://localhost:5000/api/patient/${qrKey}`);
			setPatientData(response.data);
			setError('');
		} catch (err) {
			console.error(err);
			setError('Patient not found or error fetching data.');
		}
	};

	const handleManualSubmit = (e) => {
		e.preventDefault();
		fetchPatientData(qrKey);
	};

	return (
		<div className="scanning-card-container">
			<h2>Scan QR Code or Enter QR Key</h2>
			{scanning ? (
				<div style={{ width: '300px', height: '300px' }}>
					<QrReader
						onResult={handleScan}
						constraints={{ facingMode: 'environment' }} // Use back camera on mobile
						style={{ width: '100%', height: 'auto' }}
					/>
				</div>
			) : (
				<div className="manual-entry">
					<form onSubmit={handleManualSubmit}>
						<input
							type="text"
							placeholder="Enter QR Key"
							value={qrKey}
								onChange={(e) => setQrKey(e.target.value)}
							required
						/>
						<button type="submit">Submit</button>
					</form>
						<button onClick={() => setScanning(true)}>Scan QR Code</button>
				</div>
			)}
			{error && <p className="error">{error}</p>}
			{patientData && (
				<div className="patient-data">
					<h3>Patient Medical Report</h3>
					<p><strong>Name:</strong> {patientData.name}</p>
					<p><strong>NIC No:</strong> {patientData.nicNo}</p>
					<p><strong>Blood Group:</strong> {patientData.bloodGroup}</p>
				</div>
			)}
		</div>
	);
};

export default ScanningCard;
