const express = require('express');
const multer = require('multer');
const path = require('path');
const { spawn } = require('child_process');
const mongoose = require('mongoose');
const User = require('./models/user');
const Image = require('./models/image');
const auth = require('./middleware/auth');
const authRoutes = require('./routes/auth');
const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/soy-seed', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());
app.use('/api/auth', authRoutes);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

app.post('/upload', [auth, upload.array('images', 10)], (req, res) => {
    try {
        const results = [];

        const processFiles = (index) => {
            if (index === req.files.length) {
                res.json(results);
                return;
            }

            const file = req.files[index];
            const pythonProcess = spawn('python', ['yolo_detection.py', file.path]);

            pythonProcess.stdout.on('data', (data) => {
                const defects = JSON.parse(data.toString());
                const imageRecord = new Image({ path: file.path, defects, user: req.user.id });
                imageRecord.save();
                results.push({ path: file.path, defects });
                processFiles(index + 1);
            });

            pythonProcess.stderr.on('data', (data) => {
                console.error(`Error: ${data}`);
                res.status(500).send(data.toString());
            });
        };

        processFiles(0);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/my-images', auth, async (req, res) => {
    try {
        const images = await Image.find({ user: req.user.id });
        res.json(images);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
