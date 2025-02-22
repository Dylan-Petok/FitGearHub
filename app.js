// require express so we can create the express app. using express() function 
const express = require('express');
// require the fitnessItemRoutes to use for the app, using app.use() middleware function
const fitnessItemRoutes = require('./routes/fitnessItemsRoutes');
const userRoutes = require('./routes/userRoutes');
const morgan = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const path = require('path'); // Require the 'path' module


//initializing express app
const app = express();


//server configuration
let port = 3000;
let host = 'localhost';
const uri = 'mongodb+srv://admin:admin123@cluster0.o4ifp.mongodb.net/Fitgear?retryWrites=true&w=majority&appName=Cluster0'

app.set('view engine', 'ejs');

//connect to MongoDB
mongoose.connect(uri)
.then(() => {
    //start the server
    app.listen(port, host, ()=>{
        console.log('Server is running on port', port);
    })
})
.catch(err=>console.log(err.message))

//mount middlewareapp.use(
app.use(
    session({
        secret: "ajfeirf90aeu9eroejfoefj",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongoUrl: 'mongodb+srv://admin:admin123@cluster0.jiibq.mongodb.net/demos?retryWrites=true&w=majority&appName=Cluster0'}),
        cookie: {maxAge: 60*60*1000}
        })
);

app.use(flash());

app.use((req, res, next) => {
    //console.log(req.session);
    res.locals.user = req.session.user||null;
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    res.locals.warningMessages = req.flash('warning');
    next();
});


app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(methodOverride('_method'));

// set up routes
app.get('/', (req, res) => {
    res.render('index.ejs');
})

//allows us to use the fitnessItems route file to route our fitness items, this makes it more modular instead of creating everything in here
app.use('/fitnessItems', fitnessItemRoutes);

app.use('/user', userRoutes);

//404 error
app.use((req, res, next) => {
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);
})
//error middleware function
app.use((err, req, res, next) => {
    console.log(err.stack);
        if(!err.status) {
        err.status = 500;
        err.message = ("Internal Server Error!");
    }

    res.status(err.status);
    res.render('error', {error: err});
});

