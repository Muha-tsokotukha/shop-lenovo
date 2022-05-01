const express = require("express");
const router = express.Router();
const {isAuth} = require("../auth/middlewares");
const {isProductAuthor} = require("./middlewares");
const {createProduct, deleteProduct, updateProduct, profileProducts} = require("./controller");
const {upload} = require("./multer");

router.get("/api/products/profile/:nickname", profileProducts );

router.post("/api/products",isAuth ,upload.single('image') ,createProduct );

router.delete("/api/products/:id",isAuth,isProductAuthor, deleteProduct );

router.put("/api/products/:id",isAuth, isProductAuthor, upload.single('image'), updateProduct );

module.exports = router;