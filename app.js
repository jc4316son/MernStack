import express from "express";
import flightRoutes from "./routes/flightRoutes.js";

const app = express()

// Middleware
app.use(express.json())
app.use(express.static('public'))

// Routes
app.use("/api/flights", flightRoutes)

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ error: "Something went wrong!" })
})

export default app
