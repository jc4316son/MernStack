import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    createdBy: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    editHistory: [{
        content: String,
        editedBy: String,
        editedAt: {
            type: Date,
            default: Date.now
        }
    }]
});

const LegSchema = new mongoose.Schema({
    origin: {
        type: String,
        required: true,
        uppercase: true
    },
    destination: {
        type: String,
        required: true,
        uppercase: true
    },
    departureTime: {
        type: Date,
        required: true
    },
    arrivalTime: {
        type: Date,
        required: true
    }
});

const FlightSchema = new mongoose.Schema({
    tailNumber: {
        type: String,
        required: true,
        uppercase: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    originAirport: {
        type: String,
        required: true,
        uppercase: true
    },
    destinationAirport: {
        type: String,
        required: true,
        uppercase: true
    },
    legs: [LegSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    notes: [NoteSchema],
    color: {
        type: String,
        default: function() {
            // Generate a consistent color based on tailNumber
            let hash = 0;
            for (let i = 0; i < this.tailNumber.length; i++) {
                hash = this.tailNumber.charCodeAt(i) + ((hash << 5) - hash);
            }
            const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
            return "#" + "00000".substring(0, 6 - c.length) + c;
        }
    }
});

// Validate that endDate is after startDate
FlightSchema.pre('save', function(next) {
    if (this.endDate <= this.startDate) {
        next(new Error('End date must be after start date'));
    }
    next();
});

export default mongoose.model('Flight', FlightSchema);
