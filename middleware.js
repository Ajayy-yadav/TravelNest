const Listing=require("./models/listing.js");
const Review=require("./models/reviews.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}= require("./schval.js");


module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to create listing!");
        return res.redirect("/login");
    }
    next()
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.ownerCheck=async(req,res,next)=>{
   let {id}=req.params;
   const list=await Listing.findById(id);
   if(!list.owner.equals(res.locals.curUser._id)){
    req.flash("error","you are not the owner of this listing");
    return res.redirect(`/listings/${id}`)
   }
    next();
}

module.exports.validateListing = (req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    console.log(error)
    if (error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

module.exports.validateReviews = (req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    console.log(error)
    if (error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

module.exports.authorCheck=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    const rev=await Review.findById(reviewId);
    if(!rev.author.equals(res.locals.curUser._id)){
     req.flash("error","you are not the author of this Review");
     return res.redirect(`/listings/${id}`);
    }
     next();
 }