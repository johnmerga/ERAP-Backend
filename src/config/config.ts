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
    JWT_SECRET: joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: joi.number().default(30).description('minutes after which verify email tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: joi.number().default(30).description('minutes after which reset password tokens expire'),
    BASE_URL: joi.string().required().description('Base url for the application').default('http://localhost:3000'),
    SMTP_HOST: joi.string().required().description('server that will send the emails'),
    SMTP_PORT: joi.number().required().description('port to connect to the email server'),
    SMTP_USER: joi.string().required().description('SMTP user'),
    SMTP_PASS: joi.string().required().description('password for email server'),
    EMAIL_FROM: joi.string().required().description('the from field in the emails sent by the app'),
    // EMAIL_TO: joi.string().required().description('Email to which the emails are sent'),
    CLIENT_URL: joi.string().required().description('Client url for the application').default('http://localhost:5000'),

    // payment
    CHAPA_PUB_KEY: joi.string().required().description('Chapa public key'),
    CHAPA_SECRETE_KEY: joi.string().required().description('Chapa secrete key'),

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
    /* jwt */
    jwt: {
        secret: envVars.JWT_SECRET,
        accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
        verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
        resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    },
    /* email */
    email: {

        smtp: {
            host: envVars.SMTP_HOST,
            port: envVars.SMTP_PORT,
            auth: {
                user: envVars.SMTP_USER,
                pass: envVars.SMTP_PASS,
            },
            secure: envVars.SMTP_PORT === 465 ? true : false,
        },
        emailFrom: envVars.EMAIL_FROM,
    },
    /* payment */
    payment: {
        chapa: {
            pubKey: envVars.CHAPA_PUB_KEY,
            secreteKey: envVars.CHAPA_SECRETE_KEY,
        }
    },
    /*  */
    baseUrl: envVars.BASE_URL,
    clientUrl: envVars.CLIENT_URL,
};


export default config;