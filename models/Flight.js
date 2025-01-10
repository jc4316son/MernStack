import mongoose from 'mongoose';

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

const NoteSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const AuditLogSchema = new mongoose.Schema({
    field: String,
    oldValue: mongoose.Schema.Types.Mixed,
    newValue: mongoose.Schema.Types.Mixed,
    changedAt: {
        type: Date,
        default: Date.now
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
    auditLog: [AuditLogSchema]
});

// Validate that endDate is after startDate
FlightSchema.pre('save', function(next) {
    if (this.endDate <= this.startDate) {
        next(new Error('End date must be after start date'));
    }
    next();
});

// Track changes for audit log
FlightSchema.pre('save', function(next) {
    if (this.isModified()) {
        const modifiedPaths = this.modifiedPaths();
        modifiedPaths.forEach(path => {
            if (path !== 'auditLog' && path !== 'notes') {
                this.auditLog.push({
                    field: path,
                    oldValue: this.getChanges()[path][0],
                    newValue: this.get(path)
                });
            }
        });
    }
    next();
});

export default mongoose.model('Flight', FlightSchema);
