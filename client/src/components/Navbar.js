import React, { useEffect, useState } from 'react';
import styles from './Navbar.module.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaHospital,
  FaUserMd,
  FaCalendarAlt,
  FaChartBar,
  FaSignInAlt,
  FaUserPlus,
  FaCalendarCheck,
  FaListAlt,
  FaAddressCard,
} from 'react-icons/fa';

import { BiQrScan } from "react-icons/bi";



function Navbar() {
  // adding the states 
  const [isActive, setIsActive] = useState(false);
  //add the active class
  const toggleActiveClass = () => {
    setIsActive(!isActive);
  };
  //clean up function to remove the active class
  const removeActive = () => {
    setIsActive(false)
  }

  const [user, setUser] = useState(null);
  const [hasHealthCard, setHasHealthCard] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUser(user);
      checkHealthCard(user.email);
    }
  }, [navigate]);

  const checkHealthCard = async (email) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/healthCard/exists/${email}`);
      if (response.status === 200 && response.data.exists) {
        setHasHealthCard(true);
      } else {
        setHasHealthCard(false);
      }
    } catch (error) {
      console.error('Error checking health card:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('healthCard');
    window.location.href = '/login';
  };

  return (
    <div className="App">
      <header className="App-header">
        <nav className={`${styles.navbar}`}>
          <FaHospital style={{ fontSize: '40px', color: 'white' }} />
          <a href='/' className={`${styles.logo}`}>MEDIMANAGER</a>

          <ul className={`${styles.navMenu} ${isActive ? styles.active : ''}`}>
            {/* {user && user.userType === 'Staff' && (
              <>
                <li onClick={removeActive}>
                  <Link to="/scanningCard" style={{ color: 'white' }}><BiQrScan />QR scanner</Link>
                </li>
                <li onClick={removeActive}>
                  <Link to="/makeappoinment" style={{ color: 'white' }}><FaCalendarCheck /> Make Appointment</Link>
                </li>
                <li onClick={removeActive}>
                  <Link to="/appointmentview" style={{ color: 'white' }}><FaListAlt /> View Appointments</Link>
                </li>
              </>
            )}
            {user && user.userType === 'Patient' && (
              <>
                <li onClick={removeActive}>
                  <Link to={hasHealthCard ? "/accessCard" : "/digitleHeathCard"} style={{ color: 'white' }}>
                    <FaAddressCard /> {hasHealthCard ? "Access My Health Card" : "Get Health Card"}
                  </Link>
                </li>
                <li onClick={removeActive}>
                  <Link to="/makeappoinment" style={{ color: 'white' }}><FaCalendarCheck /> Make Appointment</Link>
                </li>
                <li onClick={removeActive}>
                  <Link to="/appointmentview" style={{ color: 'white' }}><FaListAlt /> My Appointments</Link>
                </li>
              </>
            )}
            {user && user.userType === 'HSA' && (
              <>
                <li onClick={removeActive}>
                  <Link to="/staff" style={{ color: 'white' }}><FaUserMd /> Staff</Link>
                </li>
                <li onClick={removeActive}>
                  <Link to="/schedules" style={{ color: 'white' }}><FaCalendarAlt /> Schedules</Link>
                </li>
                <li onClick={removeActive}>
                  <Link to="/reports" style={{ color: 'white' }}><FaChartBar /> Reports</Link>
                </li>
              </>
            )} */}
            <div style={{ marginLeft: 'auto', display: 'flex' }}>
          {user ? (
                <li>
                  <button onClick={handleLogout} style={{ color: 'white', fontSize: '15px' }}>Logout</button>
            </li>
          ) : (
                  <li>
                    <Link to="/login" style={{ color: 'white' }}><FaSignInAlt /> Login</Link>
            </li>
          )}
          {!user && (
                <li>
                  <Link to="/register" style={{ color: 'white' }}><FaUserPlus /> Register</Link>
            </li>
          )}
            </div>
          </ul>
          <div className={`${styles.hamburger} ${isActive ? styles.active : ''}`} onClick={toggleActiveClass}>
            <span className={`${styles.bar}`}></span>
            <span className={`${styles.bar}`}></span>
            <span className={`${styles.bar}`}></span>
      </div>
    </nav>
      </header>
    </div>

  );
}
export default Navbar;
