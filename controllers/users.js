const User = require("../models/user.js");

module.exports.renderSignUpForm = (req,res) => {
    res.render("./Users/signup.ejs");
}

module.exports.signUp = async(req,res) => {
    try{
        let {username, email, password} = req.body;
    const newUser = new User({email,username});
    const registeredUser = await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err) => {
        if(err) {
            return next(err);
        }
        req.flash("success","user was registered successfully");
        res.redirect("/listings");
    });    
    } catch(e) {
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req,res) => {
    res.render("./Users/login.ejs");
}

module.exports.login = async(req,res) => {
    req.flash("success","Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res) => {
    req.logOut((err) => {
        if(err) {
            next(err);
        }
        req.flash("success","You are logged out.");
        res.redirect("/listings");
    })
}