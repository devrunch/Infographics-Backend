const mongoose = require('mongoose');

const infographicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    tags: {
        type: [String],
        required: true
    },
    image: {
        type: String,
        required: true
    },
    downloads: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Infographic = mongoose.model('Infographic', infographicSchema);

module.exports = Infographic;
