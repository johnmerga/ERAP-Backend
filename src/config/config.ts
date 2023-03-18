import joi from 'joi';
import dotenv from 'dotenv';
dotenv.config(
    {
        path: process.env.NODE_ENV === 'development' ? '.env.test' : '.env'
    }
)
/**cSpell:disable */

const envVarsSchema = joi.object({
    NODE_ENV: joi.string().valid('development', 'production', 'test').default('development'),
    PORT: joi.number().default(3000),
    MONGO_URL: joi.string().required().description('Mongo DB host url'),
    MONGO_DB_NAME: joi.string().required().description('Mongo DB name').default('test'),
}).unknown().required();


/* Validating the environment variables. */
const { error, value: envVars } = envVarsSchema.prefs(
    {
        errors: { label: 'key' },
        abortEarly: false
    },// 
).validate(process.env);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

/* Creating a config object that will be exported. */
const config = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    mongoose: {
        url: envVars.MONGO_URL,
        dbName: envVars.MONGO_DB_NAME,
    },
};


export default config;