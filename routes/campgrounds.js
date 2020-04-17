var express = require("express");
var router 	= express.Router();

var Campground 	= require("../models/campgrounds");

var middleware = require("../middleware/index.js");

//all campgrounds
router.get("/campgrounds", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
		   req.flash("error", "Campgrounds not found");
           req.redirect("back");
       } else {
          res.render("campgrounds/index",{campgrounds:allCampgrounds});
       }
    });
});

//this route is to show campgrounds after u have added new campground
router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.desc;
	var price = req.body.price;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newcampground = {name: name, image: image, desc: desc, author: author, price: price};
	
	Campground.create(newcampground, function(err, camp){
		if(err){
			req.flash("error", "Error in creating newcampground");
        	req.redirect("back");
		}
		else{
			req.flash("success", "Succesfully added new campground");
			res.redirect("/campgrounds");	
		}
	});
});

//to add new campground
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

//show when u click on show more of particular campground
router.get("/campgrounds/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundcamp){
		if(err){
			req.flash("error", "Campground not found");
    		req.redirect("back");
		}
		else{
			res.render("campgrounds/show", {campground: foundcamp});	
		}
	});
});

//EDIT campground
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundcamp){
		if(err){
			req.flash("error", "Campground not found");
    		req.redirect("back");
		}
		else{
			res.render("campgrounds/edit", {campground: foundcamp});	
		}	
	});	
});

//Update Campground
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			req.flash("error", "Campground not updated");
    		req.redirect("back");
		}
		else{
			req.flash("success", "Campground successfully updated!!");
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

//destroy Campground
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndDelete(req.params.id, function(err){
		if(err){
			req.flash("error", "Couldn't delete Campground");
    		req.redirect("back");
		}
		else{
			req.flash("success", "Campground successfully deleted");
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;