import React, { useState } from 'react';
import './PaymentPage.css'; // Import the CSS file for styling

const PaymentPage = () => {
	const [paymentDetails, setPaymentDetails] = useState({
		fullName: '',
		cardNumber: '',
		bank: '',
		expiryDate: '',
		cvc: '',
	});
	const [errors, setErrors] = useState([]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setPaymentDetails({ ...paymentDetails, [name]: value });
	};

	const validatePaymentDetails = () => {
		const newErrors = [];

		// Full Name validation
		if (!paymentDetails.fullName) {
			newErrors.push('Full name is required');
		}

		// Bank validation
		if (!paymentDetails.bank) {
			newErrors.push('Bank name is required');
		}

		// Card Number validation
		if (!/^\d{4} \d{4} \d{4} \d{4}$/.test(paymentDetails.cardNumber)) {
			newErrors.push('Card number must be a valid 16-digit number');
		}

		// Expiry Date validation (must match MM/YY format and be a future date)
		const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
		if (!expiryRegex.test(paymentDetails.expiryDate)) {
			newErrors.push('Expiry date must be in MM/YY format');
		} else {
			const [month, year] = paymentDetails.expiryDate.split('/');
			const currentYear = new Date().getFullYear() % 100;
			const currentMonth = new Date().getMonth() + 1;
			if (parseInt(year, 10) < currentYear || (parseInt(year, 10) === currentYear && parseInt(month, 10) < currentMonth)) {
				newErrors.push('Expiry date must be in the future');
			}
		}

		// CVC validation
		if (!/^\d{3}$/.test(paymentDetails.cvc)) {
			newErrors.push('CVC must be a 3-digit number');
		}

		setErrors(newErrors);
		return newErrors.length === 0; // If no errors, return true
	};

	const handlePayment = () => {
		if (validatePaymentDetails()) {
			// Handle the payment logic here (e.g., submit to payment API)
			console.log('Processing payment', paymentDetails);
		} else {
			console.log('Payment validation failed', errors);
		}
	};

	const handleCardNumberChange = (e) => {
		let { value } = e.target;

		// Remove all non-digit characters (this ensures we remove any previous formatting)
		value = value.replace(/\D/g, '');

		// Insert spaces every 4 digits
		value = value.replace(/(\d{4})(?=\d)/g, '$1 ');

		// Update the state with the formatted card number
		setPaymentDetails({ ...paymentDetails, cardNumber: value });
	};

	return (
		<div className="payment-container">
			<div className="bill-section">
				<h2>Your Bill</h2>
				<div className="bill-details">
					<p>Hospital Charges: <span>Rs. 1500</span></p>

					<p>Pharmacy Bill: <span>Rs. 500</span></p>

					<p>Discounts: <span>Rs. 0</span></p>

					<hr />
					<p>Tax: <span>0%</span></p>

					<p>Total Amount: <span>Rs. 2000</span></p>

				</div>
			</div>

			<div className="payment-section">
				<h2>Payment Gateway</h2>

				{/* Display validation errors at the top of the form */}
				{errors.length > 0 && (
					<div className="error-messages">
						<ul>
							{errors.map((error, index) => (
								<li key={index}>{error}</li>
							))}
						</ul>
					</div>
				)}

				<div className="payment-form">
					<input
						type="text"
						name="fullName"
						placeholder="Full Name"
						value={paymentDetails.fullName}
						onChange={handleInputChange}
					/>

					<input
						type="text"
						name="bank"
						placeholder="Bank"
						value={paymentDetails.bank}
						onChange={handleInputChange}
					/>

					<input
						type="text" // Use text input for custom formatting
						name="cardNumber"
						placeholder="Card Number"
						value={paymentDetails.cardNumber}
						onChange={handleCardNumberChange} // Use a custom function for handling input
						maxLength={19} // Limit to 19 characters including spaces
						pattern="[0-9 ]{19}" // Accept only numbers and spaces, with exact length of 19
						title="Enter a valid 16-digit card number (e.g., 4598 2548 1487 3252)"
					/>

					<div className="card-info">
						<input
							type="text"
							name="expiryDate"
							placeholder="MM/YY"
							value={paymentDetails.expiryDate}
							onChange={handleInputChange}
							maxLength="5" // Limit input length to 5 characters
							pattern="(0[1-9]|1[0-2])\/[0-9]{2}" // Regex pattern for MM/YY format
						/>

						<input
							type="text"
							name="cvc"
							placeholder="CVC"
							value={paymentDetails.cvc}
							onChange={handleInputChange}
							maxLength={3}
						/>
					</div>

					<button onClick={handlePayment}>Pay</button>
				</div>
			</div>
		</div>
	);
};

export default PaymentPage;
