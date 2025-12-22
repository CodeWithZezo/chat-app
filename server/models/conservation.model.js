const mongoose = require('mongoose');

const conservationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        default: []
    }]  
}, { timestamps: true });

module.exports = mongoose.model('Conservation', conservationSchema);

