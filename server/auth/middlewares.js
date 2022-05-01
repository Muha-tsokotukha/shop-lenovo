function isAuth(req,res,next){
    if(req.user) return next();
    res.status(403).end("Access forbiden");
}

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

module.exports = {
    isAuth,
    registrationValidator
}