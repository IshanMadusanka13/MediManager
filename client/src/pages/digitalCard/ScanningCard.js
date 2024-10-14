import React, { useState } from 'react';
import QRCodeScanner from 'react-qr-scanner'; // Import the QR code scanner
import axios from 'axios';
import './ScanningCard.css'; // Include your CSS styles

const ScanningCard = () => {
	const [scanning, setScanning] = useState(false);
	const [qrKey, setQrKey] = useState('');
	const [patientData, setPatientData] = useState(null);
	const [error, setError] = useState('');

	const handleScan = (data) => {
		if (data) {
			setQrKey(data); // Set the scanned QR key
			fetchPatientData(data); // Fetch patient data using the scanned key
			setScanning(false); // Stop scanning
		}
	};

	const handleError = (err) => {
		console.error(err);
		setError('Error scanning QR code'); // Handle scan errors
	};

	const fetchPatientData = async (qrKey) => {
		try {
			const response = await axios.get(`http://localhost:5000/api/patient/${qrKey}`);
			setPatientData(response.data); // Set patient data from the API response
			setError(''); // Clear any previous errors
		} catch (err) {
			console.error(err);
			setError('Patient not found or error fetching data.'); // Handle data fetch errors
		}
	};

	const handleManualSubmit = (e) => {
		e.preventDefault(); // Prevent default form submission
		fetchPatientData(qrKey); // Fetch patient data using the manually entered key
	};

	return (
		<div className="scanning-card-container">
			<h2>Scan QR Code or Enter QR Key</h2>
			{scanning ? (
				<QRCodeScanner
					delay={300}
					onError={handleError}
					onScan={handleScan}
					style={{ width: '100%', height: 'auto' }}
				/>
			) : (
				<div className="manual-entry">
					<form onSubmit={handleManualSubmit}>
						<input
							type="text"
							placeholder="Enter QR Key"
							value={qrKey}
							onChange={(e) => setQrKey(e.target.value)} // Update QR key state
							required
						/>
						<button type="submit">Submit</button>
					</form>
					<button onClick={() => setScanning(true)}>Scan QR Code</button> {/* Button to start scanning */}
				</div>
			)}
			{error && <p className="error">{error}</p>} {/* Display errors if any */}
			{patientData && (
				<div className="patient-data">
					<h3>Patient Medical Report</h3>
					<p><strong>Name:</strong> {patientData.name}</p>
					<p><strong>NIC No:</strong> {patientData.nicNo}</p>
					<p><strong>Blood Group:</strong> {patientData.bloodGroup}</p>
					{/* Add any additional patient data fields as needed */}
				</div>
			)}
		</div>
	);
};

export default ScanningCard;
