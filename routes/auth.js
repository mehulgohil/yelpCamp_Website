var express = require("express");
var router 	= express.Router();

var middleware = require("../middleware/index.js");

var passport 	= require("passport");
var User 		= require("../models/users");

router.get("/", function(req, res, next){
	res.render("landing");
	next();
});


//show register form
router.get("/register", function(req, res){
	res.render("register");
});

//handle signup logic
router.post("/register", function(req, res){
	var newUser = new User({username:req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
			return res.redirect("/register");
		}
		else{
			passport.authenticate("local")(req, res, function(){
				req.flash("success", "Welcome " + user.username);
				res.redirect("/campgrounds");
			});
		}
	});
});

//show login form
router.get("/login", function(req, res){
	res.render("login");
});

//handle login logic
router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login",
	successFlash: "Welcome"
}), function(req, res){
});

//logout
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "See you again!");
	res.redirect("/campgrounds");
});

module.exports = router;
