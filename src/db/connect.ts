import mongoose from "mongoose";
import config from "../config/config";
import logger from "../logger/logger";


export const connect = async () => {
    try {
        logger.info("Connecting to MongoDB...");
        await mongoose.connect(`${config.mongoose.url}/${config.mongoose.dbName}`, {
            connectTimeoutMS: 5000,
            
        });
        logger.info("Connected to MongoDB");
    } catch (error) {
        logger.error("Could not connect to MongoDB");
        // logger.error(error);
        process.exit(1);
    }
}

