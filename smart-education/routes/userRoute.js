const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const { body } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

router.route('/signup').post(
    [
        body('name').not().isEmpty().withMessage('Please enter your name!'),
        body('email').isEmail().withMessage('Please enter your email!')
            .custom((userEmail) => {
                return User.findOne({email: userEmail}).then((user) => {
                    if (user) {
                        return Promise.reject('Email is already exists!')
                    }
                });
            }),
        body('password').not().isEmpty().withMessage('Please enter your password!')
    ],
    authController.createUser);
router.route('/login').post(
    [
        body('email').isEmail().withMessage('Please enter your email!'),
        body('password').not().isEmpty().withMessage('Please enter your password!')
    ],
    authController.loginUser);
router.route('/logout').get(authController.logoutUser);
router.route('/dashboard').get(authMiddleware, authController.getDashboardPage);
router.route('/:id').delete(adminMiddleware, authController.deleteUser);

module.exports = router;
