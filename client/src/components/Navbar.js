import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHospital, FaUserMd, FaCalendarAlt, FaChartBar, FaSignInAlt, FaUserPlus, FaBars, FaTimes, FaCalendarCheck, FaListAlt } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    console.log('Navbar component mounted');
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUser(user);
    }
  }, [navigate]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.navContainer}>
        <Link to="/" style={styles.logo}>
          <FaHospital style={styles.logoIcon} />
          <span style={styles.logoText}>MediManager</span>
        </Link>
        <div style={styles.menuIcon} onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>
        <ul style={{ ...styles.navMenu, ...(isOpen ? styles.navMenuActive : {}) }}>
          {user && user.userType === "Staff" && (
            <>

              <li style={styles.navItem}>
                <Link to="/makeappoinment" style={styles.navLink}><FaCalendarCheck /> Make Appointment</Link>
              </li>
              <li style={styles.navItem}>
                <Link to="/appointmentview" style={styles.navLink}><FaListAlt /> View Appointments</Link>
              </li>
            </>
          )}
          {user && user.userType === "Patient" && (
            <>
              <li style={styles.navItem}>
                <Link to="/makeappoinment" style={styles.navLink}><FaCalendarCheck /> Make Appointment</Link>
              </li>
              <li style={styles.navItem}>
                <Link to="/appointmentview" style={styles.navLink}><FaListAlt /> My Appointments</Link>
              </li>
            </>
          )}
          {user && user.userType === "HSA" && (
            <>
              <li style={styles.navItem}>
                <Link to="/staff" style={styles.navLink}><FaUserMd /> Staff</Link>
              </li>
              <li style={styles.navItem}>
                <Link to="/schedules" style={styles.navLink}><FaCalendarAlt /> Schedules</Link>
              </li>
              <li style={styles.navItem}>
                <Link to="/reports" style={styles.navLink}><FaChartBar /> Reports</Link>
              </li>
            </>
          )}
          {user ? (
            <li style={styles.navItem}>
              <button onClick={handleLogout} style={styles.navButton}>Logout</button>
            </li>
          ) : (
            <li style={styles.navItem}>
              <Link to="/login" style={styles.navLink}><FaSignInAlt /> Login</Link>
            </li>
          )}
          {!user && (
            <>

              <li style={styles.navItem}>
                <Link to="/register" style={styles.navLink}><FaUserPlus /> Register</Link>
              </li>

            </>
          )}

        </ul>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#3498db',
    padding: '1rem',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    color: '#fff',
    textDecoration: 'none',
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  logoIcon: {
    marginRight: '0.5rem',
  },
  logoText: {
    display: 'inline-block',
  },
  menuIcon: {
    display: 'none',
    color: '#fff',
    fontSize: '1.5rem',
    cursor: 'pointer',
  },
  navMenu: {
    display: 'flex',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  navItem: {
    margin: '0 1rem',
  },
  navButton: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    transition: 'color 0.3s ease',
  },
  '@media (max-width: 768px)': {
    menuIcon: {
      display: 'block',
    },
    navMenu: {
      flexDirection: 'column',
      position: 'absolute',
      top: '100%',
      left: 0,
      width: '100%',
      backgroundColor: '#3498db',
      display: 'none',
      padding: '1rem 0',
    },
    navMenuActive: {
      display: 'flex',
    },
    navItem: {
      margin: '0.5rem 0',
    },
  },
};

export default Navbar;