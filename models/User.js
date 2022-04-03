const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email:{ 
        type: String,
        unique: true
    },
    full_name: String,
    nickname: String,
    password: String,
    date: {
        type: Date,
        default: Date.now
    },
    avatar: String 
});

UserSchema.pre("save", function(next){
    let user = this;  
    if( !user.isModified("password")) return next();
    bcrypt.genSalt(10, (err,salt)=>{
        if(err)return next(err);
        bcrypt.hash(user.password, salt, (err,hash)=>{
            if(err)return next(err);
            user.password = hash;
            next();
        })
    });
});
UserSchema.methods.verifyPassword = function(candidatePassword,cb){
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) return cb(err);
        cb(null, isMatch);
    });
}

module.exports = mongoose.model("User", UserSchema);