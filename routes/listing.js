import express from "express";
const router = express.Router();

import wrapAsync from "../utils/wrapAsync.js";
import Listing from "../models/listing.js";
import { isLoggedIn }  from "../middleware.js";
import { isOwner }  from "../middleware.js";
import { validateListing }  from "../middleware.js";

import multer from "multer";


import { cloudinary, storage } from "../cloudConfig.js";

const upload = multer({ storage });


import { createListing, destroyListing, index, renderEditForm, renderNewForm, showListing, updateListing } from "../controllers/listings.js";

router.route("/")
    .get(wrapAsync(index))
    .post(
        isLoggedIn,
        // validateListing,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(createListing)
    );





//     .post(
//     (req, res, next) => {
//         console.log("🚀 Raw POST hit!");
//         console.log("Content-Type:", req.headers['content-type']);
//         next();
//     },

//     upload.single('listing[image]'),

//     (req, res) => {
//         console.log("✅ Multer SUCCESS!");
//         console.log("req.body:", req.body);
//         console.log("req.file:", req.file);
//         res.send("Success! Check terminal.");
//     },

//     (err, req, res, next) => {
//         console.log("❌ MULTER ERROR caught:");
//         console.log("Message:", err.message);
//         console.log("Code:", err.code);
//         console.log("Full error:", err);   // ← this will show more details
//         res.status(400).send(`Multer Error: ${err.message || 'Unknown error'}`);
//     }
// );
    




//new route
router.get("/new", isLoggedIn, (renderNewForm));

router.route("/:id")
.get(wrapAsync(showListing))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(destroyListing));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(renderEditForm));





export default router;