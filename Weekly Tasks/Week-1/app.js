import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import envConfig from './utils/envConfig.js';


const app = express();

dotenv.config();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = envConfig.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.type('html');
    res.send('<h1>Hello World</h1><h2>Running on Node.js server.</h2>');
    res.end();
});
