const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/Product");

mongoose.connect("mongodb://localhost:27017/lenovo-shop").then(()=>{
    console.log("Connected to mongoDB");
}).catch(()=>{
    console.log("failed to connect to mongoDB");
});
const app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded());
app.use(express.json());
app.set("view engine", "ejs");

// GET API  

// Products GET API
app.get("/api/products", async (req, res)=>{
    const products = await Product.find().exec();
    res.status(200).send(products);
});
// Edit product page
app.get("/editProduct", async (req, res)=>{
    const product = await Product.findById(req.query.id).exec();
    res.render("editProduct.ejs",{
        product
    });
});

// INDEX GET API
app.get("/", async (req, res)=>{
    const products = await Product.find().exec();
    res.render("index.ejs", {
        products
    });
});
// New product page
app.get("/newProduct", (req, res)=>{
    res.render("newProduct.ejs");
});


// POST API

// Add new product
app.post("/api/products", async  (req, res)=>{
    await new Product({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price
    }).save();
    res.redirect("/");
});

// DELETE 

// delete product
app.delete("/api/products/:id", async (req,res)=>{
    await Product.deleteOne({_id: req.params.id});
    res.status(200).end();
});

app.listen(3000, ()=>{
    console.log("Listening on port 3000");
});

// PUT

// edit product

app.put("/api/products", async (req,res)=>{
    await Product.updateOne({_id: req.body._id},
        {$set: {
            title: req.body.title,
            description: req.body.description,
            price: req.body.price
        }
    });
    res.status(200).end();
})

// new Product({
//     title: "Lenovo Legion",
//     description: "Very powerfull",
//     price: 1000,
// }).save();