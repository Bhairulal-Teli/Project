const express = require("express");
const router = express.Router({mergeParams: true});
const { reviewSchema, listingSchema} = require("../schema.js");
const wrapAsync = require("../utils/wrapasync.js");
const expressError = require("../utils/expresserror.js");
const review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateListing, validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

//review route
router.get("/",validateListing,wrapAsync(reviewController.renderReviewForm));

//review add route
router.post("/add",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;