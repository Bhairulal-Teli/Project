//review will be one to many relationship as for one listing there will be many reviews.

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    Name:String,
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt: {
        type:Date,
        default:Date.now()
    },
    author: {
        type:Schema.Types.ObjectId,
        ref: "User",
    }
});

const review = mongoose.model("review",reviewSchema);
module.exports = review;