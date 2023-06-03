const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    query: {
        type: String,
        required: true
    }
});

module.exports = new mongoose.model('contact', contactSchema);