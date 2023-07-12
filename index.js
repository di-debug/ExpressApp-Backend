import mongoose from "mongoose";
import app from "./src/app.js";
import config from "./src/config/index.js";

// IFI - Self Invoke Function
( async () => {
    try {
       await mongoose.connect(config.MONGODB_URL)
       console.log("DB CONNECTED !");

        app.on('error', (err) => {
            console.error("Error: ", err);
            throw err;
        })

        const onListening = () => {
            console.log(`Listening on PORT ${config.PORT}`)
        };
        
        app.listen(config.PORT, onListening);

    } catch (error) {
        console.error("Error: ", error.message)
        throw error;
    }
})()