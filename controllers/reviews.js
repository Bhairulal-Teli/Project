const Listing = require("../models/listing");
const review = require("../models/review");

module.exports.createReview = async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(req.params.id);
    let newReview = new review(req.body.review);
    newReview.author =req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("new review saved");
    console.log(listing.reviews);
    req.flash("success","Review added.");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyReview = async(req,res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews : reviewId}})
    await review.findByIdAndDelete(reviewId );
    req.flash("success","Review Deleted.");
    res.redirect(`/listings/${id}`);
}

module.exports.renderReviewForm = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/review.ejs",{listing});
}