const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const userRoute = require('./routes/users.js');
const userAuth = require('./routes/auth.js');
const userPost = require('./routes/posts.js');
const cors = require('cors');

dotenv.config('./.env');
const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());
app.use(helmet());
// app.use(morgan("common"));

app.use('/api/user', userRoute);
app.use('/api/auth', userAuth);
app.use('/api/post', userPost);


app.listen(port, async () => {
    console.log(`Backend listen on port ${port}`);
    await mongoose.connect(process.env.MONGOO_URL);
    console.log(`connect to the mongo db successfully`);
})