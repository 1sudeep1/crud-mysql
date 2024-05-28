//importing express
const express = require('express')

//importing cors
const cors = require('cors')

const app = express()

require('dotenv').config()

const port = 4000

//importing database
const con = require('./database/connection')

// to parse req.body to plain object/json
app.use(express.json())

//importing userRoutes
const userRoutes = require('./routes/userRoutes')
con.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to database');
});

//using routes
app.use(userRoutes)

//using cors
app.use(cors)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})