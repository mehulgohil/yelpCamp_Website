var mongoose = require("mongoose");

var commetSchema = mongoose.Schema({
	text: String,
	createdAt: { type: Date, default: Date.now },
	//associating user and comment
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		}, 
		username:String
	}
});

module.exports = mongoose.model("Comment", commetSchema);