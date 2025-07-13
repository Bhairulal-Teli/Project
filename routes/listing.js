const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapasync.js");
const expressError = require("../utils/expresserror.js");
const { listingSchema} = require("../schema.js");
const review = require("../models/review.js");
const user = require("../models/user.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");

const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

//Index route
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"),wrapAsync(listingController.createListing)); //create route

//new route
router.get("/new",isLoggedIn,listingController.renderNewForm);

//Delete route
router.route("/:id")
.get(wrapAsync(listingController.showListing)) //show route
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))//delete route
.put(isLoggedIn,isOwner,upload.single("listing[image]"),  validateListing,wrapAsync(listingController.updateListing)); //update route

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.renderEditForm));

module.exports = router;