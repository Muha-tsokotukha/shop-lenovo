const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/lenovo-shop").then(()=>{
    console.log("Connected to mongoDB");
}).catch(()=>{
    console.log("failed to connect to mongoDB");
});

module.exports = {
}