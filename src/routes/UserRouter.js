const express = require ("express");
const router = express.Router()
const userController = require('../controllers/UserController');


router.post('/sign-up',userController.createUser)
router.post('/sign-in',userController.loginUser)
// router.post('/log-out', userController.logoutUser)
router.put('/update-user/:id', userController.updateUser)
router.delete('/delete-user/:id', userController.deleteUser)
router.delete('/delete-many', userController.deleteManyUser)
router.get('/getAllUser', userController.getAllUser)
router.get('/get-details/:id',userController.getDetailsUser)