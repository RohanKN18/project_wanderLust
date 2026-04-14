import mongoose from "mongoose";
const Schema = mongoose.Schema;

import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});

// FIX: use .default if needed
userSchema.plugin(passportLocalMongoose.default || passportLocalMongoose);

const User = mongoose.model("User", userSchema);

export default User;