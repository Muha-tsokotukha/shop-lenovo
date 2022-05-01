const express = require("express");
const router = express.Router();
const {isAuth} = require("../auth/middlewares");
const User = require("../user/User");
const Product = require("../product/Product");

router.get("/", async (req, res)=>{
    const products = await Product.find().populate('author', 'nickname').exec();
    res.render("index.ejs", {
        products,
        currentUser: req.user
    });
});

router.get("/newProduct",isAuth ,(req, res)=>{
    if(!req.user)return res.redirect("/login");
    res.render("newProduct.ejs",
        {
            currentUser: req.user
        }
    );
});

router.get("/editProduct",isAuth ,async (req, res)=>{
    const product = await Product.findById(req.query.id).exec();
    res.render("editProduct.ejs",{
        product,
        currentUser: req.user
    });
});

router.get("/login", (req, res)=>{
    if(req.user)return res.redirect("/profile/"+req.user.nickname);
    res.render("login.ejs");
});

router.get("/register", (req, res)=>{
    res.render("register.ejs");
});

router.get("/profile/:nickname",async (req, res)=>{
    const author = await User.findOne({nickname: req.params.nickname}).exec();
    if(!author)return res.status(404).send("Not Found");

    const products = await Product.find( {author: author._id} ).exec();
    res.render("profile.ejs", {
        products,
        currentUser: req.user,
        nickname: req.params.nickname
    });
});

module.exports = router;