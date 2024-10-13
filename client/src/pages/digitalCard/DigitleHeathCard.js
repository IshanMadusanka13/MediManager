import React from 'react';
import './DigitleHeathCard.css';

const digitleHeathCard = () => {
	return (
		<div className="container">
			<div className="card">
				<h2>FILL INTO GET YOUR HEALTH CARD</h2>
				<form className="form">
					<input type="text" placeholder="Your name" name="name" />
					<input type="email" placeholder="someone@gmail.com" name="email" />
					<input type="Password" placeholder="Password" name="Password" />
					<input type="text" placeholder="Age" name="age" />
					{/* Dropdown for Blood Group */}
					<select name="bloodGroup" className="dropdown">
						<option value="" disabled selected>Select your blood group</option>
						<option value="A+">A+</option>
						<option value="A-">A-</option>
						<option value="B+">B+</option>
						<option value="B-">B-</option>
						<option value="AB+">AB+</option>
						<option value="AB-">AB-</option>
						<option value="O+">O+</option>
						<option value="O-">O-</option>
					</select>
					<div className="radio-group">
						<label>
							Sex:
						</label>
						<label>
							<input type="radio" name="gender" value="Male" />
							Male
						</label>
						<label>
							<input type="radio" name="gender" value="Female" />
							Female
						</label>
						<label>
							<input type="radio" name="gender" value="Other" />
							Other
						</label>
					</div>
					<button type="submit">Submit</button>
				</form>
			</div>
		</div >
	);
};

export default digitleHeathCard;
