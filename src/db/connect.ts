import mongoose from "mongoose";
import config from "../config/config";
import logger from "../logger/logger";


export const connect = async () => {
    await mongoose.connect(`${config.mongoose.url}/${config.mongoose.dbName}`, {});
}

mongoose.connection.on('connecting', function () {
    logger.info('Connecting to MongoDB')
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

