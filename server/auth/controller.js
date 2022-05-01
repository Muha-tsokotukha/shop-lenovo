
const signUp = (req,res,next)=>{
    new User({
        email: req.body.email,
        fill_name: req.body.full_name,
        nickname: req.body.nickname,
        password: req.body.password
    }).save((err)=>{
        if(err) return next(err);
        res.redirect("/login");
    });
}

const signInLocal = function(req, res) {
    // console.log(req.user);
    res.redirect('/profile/'+req.user.nickname);
}

const signOut = (req,res)=>{
    req.logOut();
    res.redirect('/');
}

const googleCallBack = function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/profile/'+req.user.nickname);
}

module.exports = {
    signUp,
    signInLocal,
    signOut,
    googleCallBack,
}