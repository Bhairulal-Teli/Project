const Listing = require("./models/listing.js");
const expressError = require("./utils/expresserror.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const review = require("./models/review.js");

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in.");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req,res,next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error","You are not the owner of this listing.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next,err) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errmsg = err.details.map((el) => el.message.join(","));
        throw new expressError(400,errmsg);
    } else {
        next();
    }
}

module.exports.validateReview = (req,res,next,err) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errmsg = err.details.map((el) => el.message.join(","));
        throw new expressError(400,errmsg);
    } else {
        next();
    }
}

module.exports.isReviewAuthor = async(req,res,next) => {
    let {id, reviewId} = req.params;
    let Review = await review.findById(reviewId);
    if(!Review.author.equals(res.locals.currUser._id)) {
        req.flash("error","You did not create this review.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}