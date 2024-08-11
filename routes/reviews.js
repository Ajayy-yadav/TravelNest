const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReviews, isLoggedIn,authorCheck}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js");

router.post("/",isLoggedIn,validateReviews,wrapAsync(reviewController.createReview));

router.delete("/:reviewId",isLoggedIn,authorCheck,wrapAsync(reviewController.destroyReview));

module.exports=router;