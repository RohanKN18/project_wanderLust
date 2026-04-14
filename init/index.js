import mongoose from "mongoose";

import { data as initData } from "./data.js";

import Listing from "../models/listing.js";



const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connceted to db");
}).catch(err=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL)
}

const initDB = async () => {
    await Listing.deleteMany({});

    const updatedData = initData.map(obj => ({
        ...obj,
        owner: "69b14298260425ec5a99a490"
    }));

    await Listing.insertMany(updatedData);

    console.log("data was initialized");
};

initDB();