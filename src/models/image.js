const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    path: String,
    defects: Array,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Image = mongoose.model('Image', ImageSchema);

module.exports = Image;
