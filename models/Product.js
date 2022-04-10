const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    date: {
        type: Date,
        default: Date.now
    },
    img: String,
    author: {
        type: Schema.Types.ObjectId, ref: "User"
    },
});

module.exports = mongoose.model("Product", ProductSchema);