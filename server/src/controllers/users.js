const bcrypt = require('bcrypt')
const saltRounds = 8;
const jwt = require('jsonwebtoken')
const con = require('../database/connection')
const registerUser = async (req, res) => {
    const { fullName, email, gender, password, isAcceptTerms } = req.body;

    try {
        // Check if the email already exists
        const checkEmailQuery = 'SELECT * FROM users WHERE Email=?';
        const [results] = await con.promise().query(checkEmailQuery, [email]);
        if (results.length > 0) {
            return res.status(400).send('Email already registered');
        }

        // If email does not exist, proceed with registration
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const registerQuery = 'INSERT INTO users (Name, Email, Gender, Password, TermPolicy) VALUES (?, ?, ?, ?, ?)';
        await con.promise().query(registerQuery, [fullName, email, gender, hashedPassword, isAcceptTerms]);

        res.status(201).send('User registered successfully');
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [results] = await con.promise().query('SELECT * FROM users WHERE Email = ?', [email]);

        if (results.length === 0) {
            return res.status(400).json({ msg: 'User not found' });
        }

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.Password);
        if (isPasswordValid) {
            const token = jwt.sign(
                { id: user.ID, email: user.Email },
                process.env.SECRET_KEY,
                { expiresIn: '24h' }  // 24 hours
            );
            return res.status(200).json({ msg: 'Login successful', token, user });
        } else {
            return res.status(401).json({ msg: 'Invalid password' });
        }

    } catch (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ msg: 'Server error' });
    }
};

module.exports = { registerUser, loginUser };