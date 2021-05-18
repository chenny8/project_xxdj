const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

const authMiddelWare = require('./middleware/authMiddleWare');

//模块列表
const auth = require('./routes/auth');
const indexRouter = require('./routes/index');
const articleRouter = require('./routes/article');
const interactionRouter = require('./routes/interaction');
const memberRouter = require('./routes/member');
const activityRouter = require('./routes/activity');
const sharing_siteRouter = require('./routes/sharing_site');
const creditRouter = require('./routes/credit');


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser('gmccysk'));
app.use(session({
    resave: true, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'gmccysk',
    // cookie: {
    //     maxAge: 60 * 60 * 1000,
    // },
}));
app.use(express.static(path.join(__dirname, 'public')));
//调用中间件
app.use(function (req, res, next) {
    authMiddelWare.checkLogin(req, res, next);
})
//挂载路由
app.use('/', indexRouter);
app.use('/auth', auth);
app.use('/article', articleRouter);
app.use('/interaction', interactionRouter);
app.use('/member', memberRouter);
app.use('/activity', activityRouter);
app.use('/sharing_site', sharing_siteRouter);
app.use('/credit', creditRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
