var Campground 	= require("../models/campgrounds");
var Comment 	= require("../models/comment");

//all middlewares
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundcamp){
			if(err){
				req.flash("error", "Campground not found");
				res.redirect("back");
			}
			else{
				if(foundcamp.author.id.equals(req.user._id)){
					next();
				}
				else{
					req.flash("error", "You dont have permission");
					res.redirect("back");
				}
			}
		});	
	}
	else{
		req.flash("error", "Please log in first");
		res.redirect("/login");
	}
}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Please login first");
	res.redirect("/login");
};

module.exports = middlewareObj; 