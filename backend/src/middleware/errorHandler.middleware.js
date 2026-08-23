const errorHandler = (err, req, res, next) => {
    const statusCode =
        Number.isInteger(err.statusCode) && err.statusCode >= 400
            ? err.statusCode
            : 500;

    console.error(
        `[${req.method} ${req.originalUrl}]`,
        err.message
    );

    if (!err.isOperational) {
        console.error(err.stack);
    }

    res.status(statusCode).json({
        success: false,
        message: err.isOperational
            ? err.message
            : "Something went wrong",
    });
};

export default errorHandler;