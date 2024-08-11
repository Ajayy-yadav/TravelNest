const Listing=require("../models/listing.js");
const Review=require("../models/reviews.js");

module.exports.createReview=async(req,res)=>{
    // console.log(req.body)
    let listing=await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id
    // console.log(newReview);
    listing.reviews.push(newReview);
    req.flash("success","New review is created");
    await listing.save();
    await newReview.save();
    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    req.flash("success","Review is deleted");
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}