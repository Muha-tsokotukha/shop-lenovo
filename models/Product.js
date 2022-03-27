const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Product", ProductSchema);