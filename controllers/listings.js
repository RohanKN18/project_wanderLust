import Listing from "../models/listing.js";

export const index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

export const renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

export const showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "listing your requested for does not exist!");
    return res.redirect("/listings");
  }
  console.log();
  res.render("listings/show.ejs", { listing });
};

export const createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;

  const newLinsting = new Listing(req.body.listing);
  newLinsting.owner = req.user._id;
  newLinsting.image = { url, filename };
  await newLinsting.save();
  req.flash("success", "new listing created");
  res.redirect("/listings");
};

export const renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "listing your requested for does not exist!");
    return res.redirect("/listings");
  }


  let originalImageUrl=listing.image.url;
  originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250");
  res.render("listings/edit.ejs", { listing,originalImageUrl });
};

export const updateListing = async (req, res) => {
  let { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file!=="undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "listing updated");
  res.redirect(`/listings/${id}`);
};

export const destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "listing Deleted!");
  res.redirect("/listings");
};
