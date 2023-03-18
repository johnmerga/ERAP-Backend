
export class ApiError extends Error {
    statusCode: number;
    isOperational: boolean;
    override stack?: string;

    constructor(statusCode: number, message: string, isOperational = true, stack = "") {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.isOperational = isOperational;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
    // static badRequest(message: string) {
    //     return new ApiError(400, message);
    // }
    // static internal(message: string) {
    //     return new ApiError(500, message);
    // }
    // static forbidden(message: string) {
    //     return new ApiError(403, message);
    // }
}