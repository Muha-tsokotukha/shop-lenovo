const mongoose = require("mongoose");

const MongooseStore = require("mongoose-express-session")();
const mongooseStore = new MongooseStore({
    mongoose: mongoose,
    store: require("express-session").Store
});

module.exports = {
    mongooseStore
}