const bcrypt = require("bcryptjs");
const db = require("../config/database");

exports.register = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.execute(
            "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
            [username, hashedPassword, role]
        );

        res.redirect("/auth/login");
    } catch (error) {
        console.error(error);
        res.status(500).render("register", {
            error: "Registration failed",
            user: null,
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const [users] = await db.execute("SELECT * FROM users WHERE username = ?", [
            username,
        ]);

        if (users.length === 0) {
            return res.render("login", {
                error: "Invalid credentials",
                user: null,
            });
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.render("login", {
                error: "Invalid credentials",
                user: null,
            });
        }

        // Set user in session
        req.session.user = {
            id: user.id,
            username: user.username,
            role: user.role,
        };

        res.redirect("/feedback/dashboard");
    } catch (error) {
        console.error(error);
        res.status(500).render("login", {
            error: "Login failed",
            user: null,
        });
    }
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect("/auth/login");
};
