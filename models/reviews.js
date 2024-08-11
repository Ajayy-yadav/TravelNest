const mongoose=require("mongoose");
const schema=mongoose.Schema;

const revSchema=new schema({
    rating:{
        type:Number,
        min:1,
        max:5,
    },
    comment:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
});


const Review = mongoose.model("Review",revSchema);

module.exports=Review;