const User = require("../user/User");
const Product = require("./Product");
const fs = require("fs");
const path = require("path");

const createProduct = async (req, res)=>{
    let imagePath;
    if(!req.user)return res.redirect("/login");
    if(req.file){
        imagePath = "/images/products/" + req.file.filename;
    }
    await new Product({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        img: imagePath,
        author: req.user._id,
    }).save();
    res.redirect("/profile/"+req.user.nickname);
}

const deleteProduct = async (req,res)=>{
    const product = await Product.findById(req.params.id).exec();
    try {
        fs.unlinkSync(path.join( __dirname , "/public" , product.img));
    }catch(error){
        console.log(error.message);
    }
    await Product.deleteOne({_id: req.params.id});
    res.status(200).end();
}

const updateProduct = async (req,res)=>{
    let imagePath;
    if(req.file){
        const product = await Product.findById(req.params.id).exec();
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
};

const profileProducts = async (req, res)=>{
    const author = await User.findOne({nickname: req.params.nickname}).exec();
    if(!author)return res.status(404).send("Not Found");
    const products = await Product.find( {author: author._id} ).exec();
    res.status(200).send(products);
};

module.exports = {
    createProduct,
    deleteProduct,
    updateProduct,
    profileProducts,
}