var express 		= require('express');
var app 			= express();
var bodyParser		= require("body-parser");
var flash			= require("connect-flash");
var mongoose 		= require("mongoose");
var passport 		= require("passport");
var LocalStrategy 	= require("passport-local");
var methodOverride 	= require("method-override");

var Campground 	= require("./models/campgrounds");
var Comment 	= require("./models/comment");
var User 		= require("./models/users");
var seedDb 		= require("./seeds");

//requiring routes from routes
var commentRoutes 		= require("./routes/comments");
var campgroundRoutes 	= require("./routes/campgrounds");
var authRoutes 			= require("./routes/auth");

//seeddatabse
// seedDb();

app.use(flash());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.locals.moment = require('moment');

//PASSPORT CONFIGURATIION
app.use(require("express-session")({
	secret: "MAG THE MIGHTY",
	resave: false,
	saveUninitialized: false 
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect('mongodb://localhost:/Yelp_Camp', { useNewUrlParser: true, useUnifiedTopology: true  }); 

//req.user contains userId and username as a object 
// we pass it to every template
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
  next();
});

app.use(commentRoutes);
app.use(campgroundRoutes);
app.use(authRoutes);

app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("Server Started");
});