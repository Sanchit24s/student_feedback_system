const db = require('../config/database');

exports.submitFeedback = async (req, res) => {
    try {
        const { course, rating, comment } = req.body;
        const userId = req.session.user.id;

        await db.execute(
            'INSERT INTO feedback (user_id, course, rating, comment) VALUES (?, ?, ?, ?)',
            [userId, course, rating, comment]
        );

        res.redirect('/feedback/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).render('feedback-form', {
            error: 'Failed to submit feedback',
            user: req.session.user  // Add this line
        });
    }
};

exports.getFeedback = async (req, res) => {
    try {
        let feedback;
        const user = req.session.user;

        if (user.role === 'student') {
            // Students only see their own feedback
            [feedback] = await db.execute(
                `SELECT f.*, u.username 
                 FROM feedback f 
                 JOIN users u ON f.user_id = u.id 
                 WHERE f.user_id = ?
                 ORDER BY f.created_at DESC`,
                [user.id]
            );
        } else {
            // Teachers see all feedback
            [feedback] = await db.execute(
                `SELECT f.*, u.username 
                 FROM feedback f 
                 JOIN users u ON f.user_id = u.id 
                 ORDER BY f.created_at DESC`
            );
        }

        // Pass both feedback and user data to the view
        res.render('dashboard', {
            feedback: feedback,
            user: req.session.user  // Make sure to pass the user object
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('dashboard', {
            error: 'Failed to load feedback',
            user: req.session.user,  // Add this line
            feedback: []  // Add empty feedback array to avoid undefined
        });
    }
};