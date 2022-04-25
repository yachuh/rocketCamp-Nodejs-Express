var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser'); // 接收 cookie 資料
var logger = require('morgan'); // 日誌

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Post = require('./models/post');
const cors = require('cors');

//載入環境變數
dotenv.config({path:'./config.env'});
const DB = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
);

// 連接資料庫
mongoose.connect(DB)
.then(() => {
    console.log('資料庫連接成功')
})
.catch((err) => {
    console.log(err)
}); 


// router 邏輯
const indexRouter = require('./routes/index');
const postsRouter = require('./routes/posts');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors()); // 使用 Express cors()

// 載入 router 邏輯
app.use('/', indexRouter);
app.use('/posts',postsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
