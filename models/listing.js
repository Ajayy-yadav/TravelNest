const mongoose=require("mongoose");
const Review=require("./reviews");

const listSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    image:{
        // type:String,
        // default:"https://img.freepik.com/free-photo/wide-angle-shot-single-tree-growing-clouded-sky-during-sunset-surrounded-by-grass_181624-22807.jpg",
        // set:(v)=>v==="" ? "https://img.freepik.com/free-photo/wide-angle-shot-single-tree-growing-clouded-sky-during-sunset-surrounded-by-grass_181624-22807.jpg" : v,
        url:String,
        filename:String,
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String
    },
    reviews:[
        {
          type:mongoose.Schema.Types.ObjectId,
          ref:"Review",
        }
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true,
        }
    }
    
});

listSchema.post("findOneAndDelete",async(listing)=>{
    if (listing){
    await Review.deleteMany({_id:{$in:listing.reviews}})
    }
});

const Listing=mongoose.model("Listing",listSchema);

module.exports=Listing;