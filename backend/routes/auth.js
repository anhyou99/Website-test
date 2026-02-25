const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET;

// REGISTER
router.post("/register", async (req, res) => {
    const hashed = await bcrypt.hash(req.body.password, 10);
    const user = new User({
        email: req.body.email,
        password: hashed
    });

    await user.save();
    res.json({ message: "User created" });
});

// LOGIN
router.post("/login", async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.json({ message: "User not found" });

    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) return res.json({ message: "Wrong password" });

    const token = jwt.sign({ id: user._id }, SECRET);
    res.json({ token });
});

module.exports = router;