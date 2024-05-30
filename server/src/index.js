//importing express
const express = require('express')

//importing cors
const cors = require('cors')

const app = express()

//using cors
app.use(cors())

require('dotenv').config()

const port = 4000


// to parse req.body to plain object/json
app.use(express.json())

//importing userRoutes
const userRoutes = require('./routes/userRoutes')


//using routes
app.use(userRoutes)

app.listen(port || 4000, () => {
    console.log(`Example app listening on port ${port}`)
})