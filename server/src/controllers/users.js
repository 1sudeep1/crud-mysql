const bcrypt = require('bcrypt')
const saltRounds = 10;
const jwt = require('jsonwebtoken')
const con = require('../database/connection')
const registerUser = async (req, res) => {
    const { fullName, email, gender, password } = req.body;

    try {
        // Check if the email already exists
        const checkEmailQuery = 'SELECT * FROM users WHERE Email=?';
        const [results] = await con.promise().query(checkEmailQuery, [email]);

        if (results.length > 0) {
            return res.status(400).send('Email already registered');
        }

        // If email does not exist, proceed with registration
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const registerQuery = 'INSERT INTO users (Name, Email, Gender, Password) VALUES (?, ?, ?, ?)';
        await con.promise().query(registerQuery, [fullName, email, gender, hashedPassword]);

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
            return res.status(400).send('User not found');
        }

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.Password);

        if (!isPasswordValid) {
            return res.status(401).send('Invalid password');
        }

        const token = jwt.sign({ id: user.ID, email: user.Email }, process.env.SECRET_KEY, { expiresIn: 86400 });
        res.status(200).send({ msg: 'Login successful', token });
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).send('Server error');
    }
};

module.exports = { registerUser, loginUser };


module.exports = { registerUser, loginUser }