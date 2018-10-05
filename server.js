const express = require ('express');
const mongoose=require('mongoose');
const users = require('./routes/api/users');
const profile=require('./routes/api/profile');
const posts=require('./routes/api/posts');
const app = express();
const passport = require('passport');
const bodyParser = require('body-parser');


//Body parser middleware
//To serialize the HTML content to json object
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//DB config
const db = require('./keys').mongoURI;

//connect to mongoDB
mongoose
.connect(db)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

//Passport middleware
app.use(passport.initialize());

//Passport config
require('./config/passport')(passport);

//Other routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = 7500;
app.listen(port,() => console.log(`server running on port ${port}`));