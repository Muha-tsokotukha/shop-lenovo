const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/Product");
const User = require("./models/User");
const fs = require("fs");
const multer  = require('multer');
const path = require("path");
const passport = require("passport");
const LocalStrategy = require("passport-local");

passport.use(new LocalStrategy(
    {
        usernameField: 'email'
    },
    function(email, password, done) {
        User.findOne({ email }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        user.verifyPassword(password, (err,isMatch)=>{ 
            if(err)return done(err);
            if(!isMatch)return done(null,false);
            return done(null,user);
        });

        return done(null, user);
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});  
passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/products');
    },
    filename: function (req, file, cb) {
        const filename = file.originalname;
        let fileExt = filename.split(".");
        fileExt = fileExt[fileExt.length - 1];
        const uniqueSuffix = Date.now() + '.' + fileExt;
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});
const upload = multer({storage});

mongoose.connect("mongodb://localhost:27017/lenovo-shop").then(()=>{
    console.log("Connected to mongoDB");
}).catch(()=>{
    console.log("failed to connect to mongoDB");
});
const app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded());
app.use(express.json());
app.use(require('cookie-parser')());
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.set("view engine", "ejs");

function registrationValidator(req,res,next){
    let {
        full_name,
        email,
        nickname,
        password,
        password2
    } = req.body;
    if(!full_name || full_name.length <= 2) return res.redirect("/register?error=1");
    if(!email || email.length <= 2 || !email.includes("@")) return res.redirect("/register?error=2");
    if(!nickname || nickname.length <= 2) return res.redirect("/register?error=3");
    if(!password || password.length <= 2) return res.redirect("/register?error=4");
    if(password != password2) return res.redirect("/register?error=5");
    next();
}

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
        product,
        currentUser: req.user
    });
});

// INDEX GET API
app.get("/", async (req, res)=>{
    const products = await Product.find().exec();
    res.render("index.ejs", {
        products,
        currentUser: req.user
    });
});
// New product page
app.get("/newProduct", (req, res)=>{
    if(!req.user)return res.redirect("/login");
    res.render("newProduct.ejs",
        {
            currentUser: req.user
        }
    );
});
app.get("/login", (req, res)=>{
    if(req.user)return res.redirect("/profile/"+req.user.nickname);
    res.render("login.ejs");
});
app.get("/register", (req, res)=>{
    res.render("register.ejs");
});
app.get("/profile/:nickname",async (req, res)=>{
    const products = await Product.find().exec();
    res.render("profile.ejs", {
        products,
        currentUser: req.user
    });
});
app.get("/api/auth/signout", (req,res)=>{
    req.logOut();
    res.redirect('/');
})
// POST API

// Add new product
app.post("/api/products", upload.single('image') , async  (req, res)=>{
    let imagePath;
    if(!req.user)return res.redirect("/login");
    if(req.file){
        imagePath = "/images/products/" + req.file.filename;
    }
    await new Product({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        img: imagePath
    }).save();
    res.redirect("/profile/"+req.user.nickname);
});

app.post('/api/auth/signin', 
  passport.authenticate('local', { failureRedirect: '/login?error=1' }),
  function(req, res) {
    // console.log(req.user);
    res.redirect('/profile/'+req.user.nickname);
});

app.post("/api/auth/signup",registrationValidator ,(req,res,next)=>{
    new User({
        email: req.body.email,
        fill_name: req.body.full_name,
        nickname: req.body.nickname,
        password: req.body.password
    }).save((err)=>{
        if(err) return next(err);
        res.redirect("/login");
    });
});

// DELETE 

// delete product
app.delete("/api/products/:id", async (req,res)=>{
    const product = await Product.findById(req.params.id).exec();
    try {
        fs.unlinkSync(path.join( __dirname , "/public" , product.img));
    }catch(error){
        console.log(error.message);
    }
    await Product.deleteOne({_id: req.params.id});
    res.status(200).end();
});

app.listen(3000, ()=>{
    console.log("Listening on port 3000");
});

// PUT

// edit product

app.put("/api/products",upload.single('image') , async (req,res)=>{
    let imagePath;
    if(req.file){
        const product = await Product.findById(req.body._id).exec();
        try{
            fs.unlinkSync(path.join(__dirname, "/public", product.img));
        }catch(err){
            console.log(err.message);
        }
        imagePath = "/images/products/" + req.file.filename;
        product.title = req.body.title;
        product.description = req.body.description;
        product.price = req.body.price;
        product.img = imagePath;
        await product.save();
    }else{
        await Product.updateOne({_id: req.body._id},
            {$set: {
                title: req.body.title,
                description: req.body.description,
                price: req.body.price
            }
        });
    }
    res.status(200).end();
})

// new Product({
//     title: "Lenovo Legion",
//     description: "Very powerfull",
//     price: 1000,
// }).save();