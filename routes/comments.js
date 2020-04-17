var express = require("express");
var router = express.Router();

var Campground 	= require("../models/campgrounds");
var Comment 	= require("../models/comment");

var middleware = require("../middleware/index.js");

//new
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			res.redirect("back");
		}
		else {
			res.render("comments/new", {campground: campground});	
		}
	});
});

router.post("/campgrounds/:id/comments", middleware.isLoggedIn , function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			res.redirect("back");
		}
		else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					res.redirect("back");
				}
				else{
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Comment successfully added!!");
					res.redirect("/campgrounds/"+campground._id);//rediredt to show
				}
			});
		}
	});
});

//Edit Comment
router.get("/campgrounds/:id/comments/:comments_id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Comment.findById(req.params.comments_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		}
		else{
			res.render("comments/edit", {comment: foundComment, campground_id: req.params.id});	
		}
	});
});

//Update comment
router.put("/campgrounds/:id/comments/:comments_id", middleware.checkCampgroundOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comments_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		}
		else{
			req.flash("success", "Comment successfully updated!!");
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

//delete comment
router.delete("/campgrounds/:id/comments/:comments_id", middleware.checkCampgroundOwnership, function(req,res){
	Comment.findByIdAndDelete(req.params.comments_id, function(err, foundComment){
		if(err){
			console.log(err);
			res.redirect("back");
		}
		else{
			req.flash("success", "Comment successfully deleted!!");
			res.redirect("/campgrounds/"+req.params.id);
		}
	});	
});	

module.exports = router;