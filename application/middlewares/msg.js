exports.msg = function (req, res, next) {

    res.renderErr = function (data, statusCode) {
        if (statusCode === undefined) statusCode = 400;

        return res.status(statusCode).render('msg/error', {
            message: data.message
        });
    }

    next();
}