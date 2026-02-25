const router = require("express").Router();
const Note = require("../models/Note");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET;

// Middleware kiểm tra token
function auth(req, res, next) {
    const token = req.headers["authorization"];
    if (!token) return res.status(401).json({ message: "No token" });

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded; // chứa id user
        next();
    } catch {
        res.status(401).json({ message: "Invalid token" });
    }
}

// GET notes của user đang đăng nhập
router.get("/", auth, async (req, res) => {
    const notes = await Note.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
});

// ADD note
router.post("/", auth, async (req, res) => {
    const note = new Note({
        title: req.body.title,
        content: req.body.content,
        userId: req.user.id
    });

    await note.save();
    res.json({ message: "Note added" });
});

// DELETE note (chỉ xóa note của mình)
router.delete("/:id", auth, async (req, res) => {
    await Note.findOneAndDelete({
        _id: req.params.id,
        userId: req.user.id
    });

    res.json({ message: "Note deleted" });
});

module.exports = router;