import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import envConfig from './utils/envConfig.js';

dotenv.config();
const app = express();
const PORT = envConfig.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const BASE_DIR = path.join(process.cwd(), 'files');

if (!fs.existsSync(BASE_DIR)) {
    fs.mkdirSync(BASE_DIR);
}

// Serve home HTML
app.get('/', (req, res) => {
    const htmlPath = path.join(process.cwd(), 'home.html');
    res.sendFile(htmlPath);
});


// List all files in the directory
app.get('/files', (req, res) => {
    fs.readdir(BASE_DIR, (err, files) => {
        if (err) return res.status(500).send({ error: 'Failed to list files' });
        res.send(files);
    });
});

// Create a file
app.post('/file', (req, res) => {
    const { filename, content } = req.body;
    if (!filename) return res.status(400).send({ error: 'Filename is required' });

    const filePath = path.join(BASE_DIR, filename);
    fs.writeFile(filePath, content || '', 'utf8', (err) => {
        if (err) return res.status(500).send({ error: 'Failed to create file' });
        res.send({ message: 'File created', filename });
    });
});

app.get('/file/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(BASE_DIR, filename);
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return res.status(404).send({ error: 'File not found' });
        res.send({ filename, content: data });
    });
});

app.delete('/file/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(BASE_DIR, filename);
    fs.unlink(filePath, (err) => {
        if (err) return res.status(404).send({ error: 'File not found or could not be deleted' });
        res.send({ message: 'File deleted', filename });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
