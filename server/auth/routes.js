const express = require("express");
const router = express.Router();
const passport = require("passport");
const {signUp, signInLocal, signOut, googleCallBack} = require("./controller");

const {registrationValidator} = require("./middlewares");

router.get("/api/auth/signout" , signOut);

router.get('/api/auth/google/signin', passport.authenticate('google'));

router.get('/api/auth/google', passport.authenticate('google', { failureRedirect: '/login?error=2' }), googleCallBack);

router.post('/api/auth/signin', passport.authenticate('local', { failureRedirect: '/login?error=1' }), signInLocal );

router.post("/api/auth/signup",registrationValidator ,signUp);

module.exports = router;