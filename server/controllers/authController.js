const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// User registration
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  console.log('Request Body:', req.body);
  // Validate input fields
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please fill in all fields.' });
  }

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const user = new User({ name, email, password });
    await user.save();

    // Respond with success message and token
    res.status(201).json({
      message: 'User registered successfully',
      token: generateToken(user._id), // Optionally send the token back
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// User login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  console.log('Request Body:', req.body);
  // Validate input fields
  if (!email || !password) {
    return res.status(400).json({ message: 'Please fill in all fields.' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      // Generate token for the user
      res.json({
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};
