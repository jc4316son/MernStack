import express from 'express';
import Flight from '../models/Flight.js';

const router = express.Router();

// Create a new flight
router.post('/', async (req, res) => {
    try {
        const flight = new Flight(req.body);
        await flight.save();
        res.status(201).json(flight);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all flights
router.get('/', async (req, res) => {
    try {
        const flights = await Flight.find().sort({ startDate: 1 });
        res.json(flights);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get flights within a date range
router.get('/range', async (req, res) => {
    try {
        const { start, end } = req.query;
        const flights = await Flight.find({
            $or: [
                // Flight starts within range
                {
                    startDate: {
                        $gte: new Date(start),
                        $lte: new Date(end)
                    }
                },
                // Flight ends within range
                {
                    endDate: {
                        $gte: new Date(start),
                        $lte: new Date(end)
                    }
                },
                // Flight spans the entire range
                {
                    startDate: { $lte: new Date(start) },
                    endDate: { $gte: new Date(end) }
                }
            ]
        }).sort({ startDate: 1 });
        res.json(flights);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a specific flight
router.get('/:id', async (req, res) => {
    try {
        const flight = await Flight.findById(req.params.id);
        if (!flight) {
            return res.status(404).json({ error: 'Flight not found' });
        }
        res.json(flight);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a flight
router.put('/:id', async (req, res) => {
    try {
        const flight = await Flight.findById(req.params.id);
        if (!flight) {
            return res.status(404).json({ error: 'Flight not found' });
        }

        // Update flight fields
        const updateFields = ['tailNumber', 'startDate', 'endDate', 'originAirport', 'destinationAirport', 'legs'];
        updateFields.forEach(field => {
            if (req.body[field] !== undefined) {
                flight[field] = req.body[field];
            }
        });

        await flight.save(); // This will trigger the audit log
        res.json(flight);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Add a note to a flight
router.post('/:id/notes', async (req, res) => {
    try {
        const flight = await Flight.findById(req.params.id);
        if (!flight) {
            return res.status(404).json({ error: 'Flight not found' });
        }

        flight.notes.push({ content: req.body.content });
        await flight.save();
        res.json(flight);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get audit log for a flight
router.get('/:id/audit', async (req, res) => {
    try {
        const flight = await Flight.findById(req.params.id);
        if (!flight) {
            return res.status(404).json({ error: 'Flight not found' });
        }
        res.json(flight.auditLog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a flight
router.delete('/:id', async (req, res) => {
    try {
        const flight = await Flight.findByIdAndDelete(req.params.id);
        if (!flight) {
            return res.status(404).json({ error: 'Flight not found' });
        }
        res.json({ message: 'Flight deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
