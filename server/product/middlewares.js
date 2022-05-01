const Product = require("./Product");

async function isProductAuthor(req,res,next){
    const product = await Product.findById(req.params.id).exec();
    if( req.user._id.toString()  === product.author.toString() )return next();
    res.status(403).end("Access forbiden");
}

module.exports = {
    isProductAuthor,
}