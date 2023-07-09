const mongoose = require('mongoose');

const contact = mongoose.model('contact', {
    name: {
        type: String,
        required: true,
    },
    nohp: {
        type: String,
        require: true
    },
    email: {
        type: String
    }
});

module.exports = {contact};