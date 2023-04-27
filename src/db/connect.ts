import mongoose from "mongoose";
import config from "../config/config";
import logger from "../logger/logger";

const isDevelopment = process.env.NODE_ENV === 'development'
export const connect = async () => {
     await mongoose.connect(`${config.mongoose.url}`, {});
}

mongoose.connection.on('connecting', function () {
    isDevelopment ? logger.info('...connecting to local MongoDB') : logger.info('...connecting to MongoDB Atlas')
})

mongoose.connection.on('error', function () {
    logger.error("Could not connect to MongoDB");
    process.exit(1);
})

mongoose.connection.on('connected', function () {
    logger.info("MongoDB Connected")
})

mongoose.connection.on('reconnected', function () {
    console.log('MongoDB reconnected!');
});


mongoose.connection.on('disconnected', function () {
    logger.error("MongoDB Disconnected");

})


// Close the Mongoose connection, when receiving SIGINT
process.on('SIGINT', function () {
    mongoose.connection.close(true)

});

