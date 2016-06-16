exports.isUserName = function (string) {
    return /^[a-zA-Z][a-zA-Z0-9_]{4,11}$/.test(string);
}