import express from "express";

const app = express()

// Middleware
app.use(express.json())

// Routes
app.get("/", (req, res) => {
    res.json({ message: "Welcome to MERN Stack" })
})

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ error: "Something went wrong!" })
})

export default app
