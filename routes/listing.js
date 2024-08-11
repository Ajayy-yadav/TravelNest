const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn,ownerCheck,validateListing}=require("../middleware.js");
const listingsController=require("../controllers/listings.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});
// const upload = multer({ dest: 'uploads/' })

router.route("/")
.get(wrapAsync(listingsController.index))//all lists
.post(isLoggedIn,upload.single("listing[image]"),wrapAsync(listingsController.createListing));//create route
// .post(upload.single("listing[image]"),(req,res)=>{
//     console.log(req.body);
//     res.send(req.file);
// });

//new route
router.get("/new",isLoggedIn,listingsController.renderNew);

router.route("/:id")
.get(wrapAsync(listingsController.showListings))//show route
.put(isLoggedIn,ownerCheck,upload.single("listing[image]"),validateListing,wrapAsync(listingsController.updateListing))//upadte route
.delete(isLoggedIn,ownerCheck,wrapAsync(listingsController.destroyListing));//delete route
//edit route
router.get("/:id/edit",isLoggedIn,ownerCheck,wrapAsync(listingsController.editRender));

module.exports=router;