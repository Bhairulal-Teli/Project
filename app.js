if(process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapasync.js");
const expressError = require("./utils/expresserror.js");
const { listingSchema, reviewSchema} = require("./schema.js");
const review = require("./models/review.js");
const data = require("./init/data.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const DB_URL = process.env.ATLAS_DB_URL;

const store = MongoStore.create({
    mongoUrl: DB_URL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error",() => {
    console.log("ERROR in sessionstore : ",err);
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 3*24*60*60*1000,
        maxAge: 3*24*60*60*1000,
        httpOnly: true
    }
};



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("Connected to db");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(DB_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

// app.get("/",(req,res) => {
//     res.send("working root path");
// });

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.use("/listings",listingsRouter);
app.use("/listings/:id/review",reviewsRouter);
app.use("/",userRouter);

app.all("*",(req,res,next) => {
    next(new expressError(404,"Page Not Found"));
});

app.use((err,req,res,next) => {
    let {statusCode=500,message="Something went wrong"}= err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{message});
})

app.listen(8080,() => {
    console.log("Listening to port 8080");
});