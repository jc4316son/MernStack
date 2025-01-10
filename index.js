import mongoose from "mongoose";
import app from "./app.js"

( async () => {
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/flightapp")
        console.log("DB CONNECTED");

        app.listen(5000, () => {
            console.log("Listening on PORT 5000");
        });
    } catch (error) {
        console.error("error: ",error);
        throw error;
    }
})()
