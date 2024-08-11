const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

main().then((res)=>{
    console.log(res);
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
  return 'connection successful'
}

const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"6665b2c4bc5624a624fcfc53"}))
    await Listing.insertMany(initData.data);
    console.log("data was init");
}

initDB();