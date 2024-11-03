const cors = require('cors');
const express = require('express');

const PORT = process.env.PORT || 8000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors({
    credentials: true,
    optionsSuccessStatus: 200,
    allowedHeaders: 'Content-Type, Authorization',
    methods: "GET, POST, OPTIONS, PUT, DELETE",
    origin: ["http://localhost:3000"]
}));

// USER

const readUser = require('./routes/user/read');
app.use('/', readUser);

app.listen(PORT, () => {
    console.log('Utilisation du port ' + PORT);
})