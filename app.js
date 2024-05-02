const express=require("express");
const app=express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
const path=require("path");
const methodOverride = require("method-override");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
async function main() {
    await mongoose.connect(MONGO_URL);
}
main().then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err);
});

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

app.get("/", (req,res) => {
    res.send("Hi, I am Groot");
});
app.get("/listings", async (req,res) => {
   const allListings =  await Listing.find({})
   res.render("listings/index.ejs" , {allListings});
});

app.get("/listings/new",(req,res) => {
    res.render("listings/new.ejs");
});

app.get("/listings/:id", async (req,res) => {
   let {id} =req.params;
   const listing = await Listing.findById(id);
   res.render("listings/show.ejs", {listing});
})

app.post("/listings", async (req,res) => {
   //let {title,description,image,price,location} = req.body;
   const newListing = new Listing(req.body.listing);
   await newListing.save();
   res.redirect("/listings");
});

app.get("/listings/:id/edit" , async (req,res) => {
   let {id} =req.params;
   const listing = await Listing.findById(id);
   res.render("listings/edit.ejs",{listing});
});

app.put("/listings/:id",async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect("/listings");
});

app.delete("/listings/:id", async (req,res) => {
    let {id} =req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});

// app.get("/testListing", async (req,res) => {
//     let sampleListing = new Listing({
//         title:"My new Villa",
//         description:"By the Beach",
//         location:"Nagpur, Maharashtra",
//         country:"India"
//     });
//     await sampleListing.save();
//     console.log("saved");
//     res.send("successful testing");
// });
app.listen(8080, () => {
    console.log("server is listening to port 8080");
});