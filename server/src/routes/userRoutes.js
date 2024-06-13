const express= require('express')
const { registerUser, loginUser, getAllUsers } = require('../controllers/users')
router= express.Router()

router.post('/register', registerUser)

router.post('/login', loginUser)

router.get('/teams', getAllUsers)
module.exports=router