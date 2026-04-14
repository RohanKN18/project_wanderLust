import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}


import express from "express";
const app = express();
import mongoose from "mongoose";
import ejsMate from "ejs-mate" ;
app.engine('ejs',ejsMate);
import path from "path";
import { fileURLToPath } from "url";

import wrapAsync from "./utils/wrapAsync.js";
import ExpressError from "./utils/ExpressError.js";

import { listingSchema , reviewSchema} from "./schema.js";

import ListingRouter from "./routes/listing.js";
import ReviewRouter from "./routes/review.js";
import UserRouter from "./routes/user.js";

import session from "express-session";
import MongoStore from "connect-mongo";
import flash from "connect-flash";

import passport from "passport";
import LocalStrategy from "passport-local";
import User from "./models/user.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,"public")));

app.use(express.urlencoded({ extended: true }));   // ← Must be before routes
app.use(express.json());                           // Good to add this too

import methodOverride from "method-override";
app.use(methodOverride('_method'));



import Listing from "./models/listing.js";
import Review from "./models/review.js";


// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

const dbUrl=process.env.ATLASDB_URL;

main().then(()=>{
    console.log("connceted to db");
}).catch(err=>{
    console.log(err);
})

// async function main(){
//     await mongoose.connect(MONGO_URL)
// }

async function main(){
    await mongoose.connect(dbUrl)
}

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
})

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
});

const sessionOptions={
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*1000,
        maxAge:7*24*60*1000,
        httpOnly:true,
    }
};

// app.get("/",(req,res)=>{
//     res.send("hi,i am root");
// });



app.use(session(sessionOptions));
app.use(flash());


//authentication 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

app.use((req, res, next) => {
    console.log("Request received:", req.method, req.url);
    next();
});


// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//     });

//     let registeredUser= await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// });





app.use("/listings",ListingRouter);
app.use("/listings/:id/reviews",ReviewRouter);
app.use("/",UserRouter)



app.use((req,res,next)=>{
  next(new ExpressError(404,"Page not found!"));
});


app.use((err,req,res,next)=>{
    let {statusCode=500, message="something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{err});
    // res.status(statusCode).send(message);
});







app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});