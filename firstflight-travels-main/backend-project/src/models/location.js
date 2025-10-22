// filepath: d:\msd project\firstflight-travels-main\backend-project\src\models\location.js
const mongoose = require('mongoose');

const Location = mongoose.models.Location || mongoose.model('Location', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    available: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
}));

module.exports = Location;