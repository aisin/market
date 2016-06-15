module.exports = function (app) {

    app.use(require('./home'));
    require('./user')(app); // 因为 passport 的依赖使得 require 方式不同

};