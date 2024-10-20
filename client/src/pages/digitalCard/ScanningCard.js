import React, { useState } from 'react';
import { QrReader } from 'react-qr-scanner'; // Correct import
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
			// Fetching patient data from the server using the qrKey
			const response = await axios.get(`http://localhost:5000/api/healthCard/get/${qrKey}`);

			if (response.data) {
				setPatientData(response.data);
				setError('');
			} else {
				setPatientData(null);
				setError('Patient not found or error fetching data.');
			}
		} catch (err) {
			console.error(err);
			setPatientData(null);
			setError('Patient not found or error fetching data.');
		}
	};

	const handleManualSubmit = (e) => {
		e.preventDefault();
		fetchPatientData(qrKey);
	};

	const startScanning = () => {
		// Check if getUserMedia is supported
		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			setScanning(true);
		} else {
			setError('Camera not supported in this browser.');
		}
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
					<div className="card-glass manual-entry">
						<form onSubmit={handleManualSubmit}>
							<input
								type="text"
								placeholder="Enter QR Key"
								value={qrKey}
								onChange={(e) => setQrKey(e.target.value)}
								required
								maxLength={8}
								className="glass-input"
							/>
							<button type="submit" className="glass-button">Submit</button>
						</form>
						<button onClick={startScanning} className="glass-button">Scan QR Code</button>
				</div>
			)}

			{error && <p className="error">{error}</p>}
			{patientData && (
				<div className="patient-data">
					<h1 style={{ color: 'green', textAlign: 'center' }}>Medical Report</h1>
					<div className="medical-report">
						<p style={{ textAlign: 'left' }}><strong>Name:</strong> {patientData.name}</p>
						<p style={{ textAlign: 'left' }}><strong>Age:</strong> {patientData.age} years old</p>
						<p style={{ textAlign: 'left' }}><strong>Gender:</strong> {patientData.gender}</p>
						<p style={{ textAlign: 'left' }}><strong>NIC No:</strong> {patientData.nicNo}</p>
						<p style={{ textAlign: 'left' }}><strong>Blood Group:</strong> {patientData.bloodGroup}</p>
						<p style={{ textAlign: 'left' }}><strong>Email:</strong> {patientData.email}</p>
						<p style={{ textAlign: 'left' }}><strong>Date of Birth:</strong> 12th March 1979</p>
						<p style={{ textAlign: 'left' }}><strong>Medical Record Number:</strong> {patientData.qrKey}</p>
						<hr />
						<br />

						<h4 style={{ textAlign: 'left' }}>Presenting Complaint:</h4>
						<p style={{ textAlign: 'left' }}><ul>
							<li>The patient presented with persistent chest pain, shortness of breath, and fatigue for the last two days.</li>
						</ul>
						</p>
						<h4 style={{ textAlign: 'left' }}>History of Present Illness:</h4>
						<p style={{ textAlign: 'left' }}>
							<ul>
								<li>The patient reports intermittent chest discomfort that worsened on exertion and improved with rest. No history of nausea, vomiting, or dizziness. The patient also reports increased fatigue over the last week.</li>
							</ul>
						</p>

						<h4 style={{ textAlign: 'left' }}>Past Medical History:</h4>
						<ul style={{ textAlign: 'left' }}>
							<li>Hypertension: Diagnosed 10 years ago.</li>
							<li>Type 2 Diabetes: Diagnosed 8 years ago, controlled on medication.</li>
							<li>Previous Surgeries: Appendectomy (2015).</li>
							<li>Medications: Metformin 500 mg, Amlodipine 10 mg.</li>
							<li>Allergies: No known drug allergies.</li>
						</ul>

						<h4 style={{ textAlign: 'left' }}>Family History:</h4>
						<ul style={{ textAlign: 'left' }}>
							<li>Father: Passed away due to a heart attack at the age of 65.</li>
							<li>Mother: Hypertension, alive at 72 years.</li>
						</ul>
						<hr />
						<h3 style={{ textAlign: 'left' }}>Physical Examination:</h3>
						<p style={{ textAlign: 'left' }}><strong>General Appearance:</strong> Alert and oriented, in mild distress due to chest pain.</p>
						<p style={{ textAlign: 'left' }}><strong>Vital Signs:</strong></p>
						<ul style={{ textAlign: 'left' }}>
							<li>Blood Pressure: 160/95 mmHg</li>
							<li>Heart Rate: 90 bpm</li>
							<li>Respiratory Rate: 20 breaths/min</li>
							<li>Temperature: 98.7°F</li>
							<li>Oxygen Saturation: 94% on room air</li>
						</ul>
						<br />
						<p style={{ textAlign: 'left' }}><strong>Cardiovascular Examination:</strong> Normal S1 and S2 sounds, no murmurs. Mild jugular venous distension noted.</p>
						<p style={{ textAlign: 'left' }}><strong>Respiratory Examination:</strong> Clear to auscultation bilaterally, no wheezing or crackles.</p>
						<hr />
						<h4 style={{ textAlign: 'left' }}>Investigations:</h4>
						<ul style={{ textAlign: 'left' }}>
							<li>ECG: Sinus tachycardia, no acute ischemic changes.</li>
							<li>Chest X-Ray: Normal heart size, clear lung fields.</li>
							<li>Blood Tests: Complete Blood Count (CBC): Within normal limits.</li>
							<li>Blood Sugar (Fasting): 120 mg/dL.</li>
							<li>Lipid Profile: Elevated LDL cholesterol at 160 mg/dL.</li>
						</ul>
						<hr></hr>
						<h4 style={{ textAlign: 'left' }}>Diagnosis:</h4>
						<p style={{ textAlign: 'left' }}>Likely unstable angina, hypertensive heart disease, and poorly controlled diabetes.</p>
						<hr />
						<h4 style={{ textAlign: 'left' }}>Plan:</h4>
						<ul style={{ textAlign: 'left' }}>
							<li>Admission to Cardiology Unit for further evaluation and management.</li>
							<li>Start anti-anginal therapy with nitroglycerin and beta-blockers.</li>
							<li>Optimize diabetes control with insulin adjustments.</li>
							<li>Cardiac enzyme tests and repeat ECG to rule out myocardial infarction.</li>
							<li>Cardiology consult for potential coronary angiography.</li>
						</ul>
						<hr />
						<p style={{ textAlign: 'end' }}><strong>Doctor's Name:</strong> Dr. Emily Carter</p>
						<p style={{ textAlign: 'end' }}><strong>Date:</strong> 15th October 2024</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default ScanningCard;
