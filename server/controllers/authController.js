const User = require('../models/User');
const jwt = require('jsonwebtoken');


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

exports.register = async (req, res) => {
  const { email, password, userType } = req.body;
  console.log('Request Body:', req.body);

  if (!email || !password) {
    return res.status(400).json({ message: 'Please fill in all fields.' });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ email, password, userType });
    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  console.log('Request Body:', req.body);

  if (!email || !password) {
    return res.status(400).json({ message: 'Please fill in all fields.' });
  }

  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {

      res.json({
        token: generateToken(user._id),
        user: user,
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};
