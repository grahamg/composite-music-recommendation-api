module.exports = (req, res, next) => {
    req.passedValue = 'test';
    next();
};
