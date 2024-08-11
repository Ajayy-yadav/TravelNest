if (process.env.NODE_ENV!="production"){
require('dotenv').config()
// console.log(process.env.CLOUD_NAME);
}
const PORT=process.env.PORT || 8080;

const express=require("express")
const path=require("path")
const mongoose=require("mongoose")
let app = express();
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const sessions=require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
// const {listingSchema,reviewSchema}= require("./schval.js");


const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/reviews.js");
const userRouter=require("./routes/user.js");

app.engine("ejs",ejsMate)
app.use(methodOverride('_method'))
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")))
app.set("views engine",'ejs');
app.use(express.urlencoded({extended:true}));
const dburl=process.env.ATLASDB_URL;

main().then((res)=>{
    console.log(res);
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(dburl);
  return 'connection successful'
}

const store = MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24 *3600,
})

store.on("error",()=>{
    console.log("Error in MONGO SESSION STORE",err)
});

const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
    expires:Date.now()+7 * 24 * 60 * 60 * 1000,
    maxAge:7 * 24 * 60 * 60 * 1000,
    httpOnly:true,
    }
}

//root route
// app.get("/",(req,res)=>{
//     res.send("working root")
// });

app.use(sessions(sessionOptions))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    // console.log(req.user)
    res.locals.curUser=req.user;
    next();
})

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

// app.get("/demouser",async(req,res)=>{
//     const fakeUser = new User({
//         email:"student@gmail.com",
//         username:"rahulnayak",
//     });
//     let userRegister = await User.register(fakeUser,"helloworld");
//     res.send(userRegister);
// })

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found !"))
})

app.use((err,req,res,next)=>{
    let {status=500,message="something went wrong !"} = err;
    // res.status(status).send(message);
    res.status(status).render("./listings/err.ejs",{message})
})

app.listen(PORT,()=>{
    console.log("listening to the port 8080");
})
 
