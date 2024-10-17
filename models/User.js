const db = require('../config/database');

class User {
    static async findByUsername(username) {
        try {
            const [users] = await db.execute(
                'SELECT * FROM users WHERE username = ?',
                [username]
            );
            return users[0];
        } catch (error) {
            throw error;
        }
    }

    static async create(username, hashedPassword, role) {
        try {
            const [result] = await db.execute(
                'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
                [username, hashedPassword, role]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = User;