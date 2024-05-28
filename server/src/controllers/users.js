const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const con = require('../database/connection')
const registerUser = async (req, res) => {
    const { fullName, email, gender, password } = await req.body

    // Check if the email already exists
    const checkEmailQuery = 'SELECT * FROM users WHERE Email=?'
    con.query(checkEmailQuery, [email], (err, results) => {
        if (err) {
            return res.status(500).send('Server error');
        }
        if (results.length > 0) {
            return res.status(400).send('Email already registered');
        } else {
            // If email does not exist, proceed with registration
            const hashedPassword = bcrypt.hashSync(password, 8);
            const registerQuery = 'INSERT INTO users (Name, Email, Gender, Password) VALUES (?, ?, ?, ?)'
            con.query(registerQuery, [fullName, email, gender, hashedPassword], (err, result) => {
                if (err) {
                    return res.status(500).send('Server error');
                }
                res.status(201).send('User registered successfully');
            })
        }
    })


}

module.exports = { registerUser }