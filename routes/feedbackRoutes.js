const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/auth/login');
    }
};

// Add user role check middleware
const isStudent = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'student') {
        next();
    } else {
        res.redirect('/feedback/dashboard');
    }
};

// Dashboard route
router.get('/dashboard', isAuthenticated, feedbackController.getFeedback);

// Feedback submission form route
router.get('/submit', isAuthenticated, isStudent, (req, res) => {
    res.render('feedback-form', { user: req.session.user });
});

// Submit feedback POST route
router.post('/submit', isAuthenticated, isStudent, feedbackController.submitFeedback);

module.exports = router;