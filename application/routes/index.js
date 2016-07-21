module.exports = function (app) {

    require('./user')(app); // 因为 passport 的依赖使得 require 方式不同
    app.use(require('./home'));
    app.use(require('./topic'));
    app.use(require('./admin'));


    app.use(require('./404'));
};