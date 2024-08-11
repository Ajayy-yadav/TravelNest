const Listing=require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async(req,res,next)=>{
    // let allList=new Listing({title:"my new villa",description:"by the beach",price:1200,location:"goa",country:"india"});
    // allList.save();
    // console.log("data saved");
    // res.send("successful");
    let allLists=await Listing.find();
    res.render("./listings/index.ejs",{allLists});
}

module.exports.renderNew=(req,res)=>{
    res.render("./listings/new.ejs");
}

module.exports.showListings=async(req,res,next)=>{
    let {id}=req.params;
    let list=await Listing.findById(id).populate(
        {path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!list){
        req.flash("error","Listing you are requesting for does not exist");
        return res.redirect("/listings")
    }
    res.render("./listings/show.ejs",{list});
}

module.exports.createListing=async(req,res,next)=>{
    let response=await geocodingClient
    .forwardGeocode({
        query:req.body.listing.location,
        limit:1,
    })
    .send();
    // console.log(response.body.features[0].geometry);
    // let {title:til,description:des,image:img,price:rs,location:lo,country:co}=req.body;
    // const list1=new Listing({title:til,description:des,image:img,price:rs,location:lo,country:co});
    let url=req.file.path;
    let filename=req.file.filename;
    // console.log(url,"------",filename);
    const newListing=new Listing(req.body.listing);
    newListing.image={url,filename};
    newListing.owner=req.user._id;
    newListing.geometry=response.body.features[0].geometry;
    await newListing.save();
    req.flash("success","new Listing is created");
    res.redirect('/listings');
}

module.exports.editRender=async(req,res,next)=>{
    let {id}=req.params;
    let list=await Listing.findById(id);
    if(!list){
        req.flash("error","Listing you are requesting for does not exist");
        return res.redirect("/listings")
    }
    let originalImage=list.image.url;
    originalImage=originalImage.replace("/upload","/upload/w_250");
    res.render("./listings/edit.ejs",{list,originalImage});
}

module.exports.updateListing=async(req,res,next)=>{
    let {id}=req.params;
    // if (!req.body.listing){
    //     next(new ExpressError(400,"send a valid data listing"))
    // }
//    const list=await Listing.findById(id);
//    if(!list.owner.equals(res.locals.curUser._id)){
//     req.flash("error","you are not the owner of this listing");   //defined in middleware files
//     return res.redirect(`/listings/${id}`)
//    } 
    let listingUpdated=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listingUpdated.image={url,filename};
    await listingUpdated.save();
    }
    req.flash("success","Listing is updated");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async(req,res,next)=>{
    let {id}=req.params;
    req.flash("success","Listing is Deleted");
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}