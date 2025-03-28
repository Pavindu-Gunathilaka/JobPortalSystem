const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    location: { type: String, required: true },
    salary: { type: Number },
    deadline: { type: Date }
});

module.exports = mongoose.model('Job', jobSchema);