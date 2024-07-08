const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/soy-seed', { useNewUrlParser: true, useUnifiedTopology: true });

const ImageSchema = new mongoose.Schema({
    path: String,
    defects: Array
});

const Image = mongoose.model('Image', ImageSchema);

module.exports = Image;
