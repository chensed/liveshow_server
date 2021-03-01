var express = require('express');

var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');


var app = express();

//var domain='app.ourbethel.cn'
var BASE_HEADER='/liveshow/';


//for 跨域问题
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  
  res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,token");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(__dirname+'/images')); //开放images目录
app.use(express.static(__dirname+'/upload')); //开放upload目录

//app.use('/angular', express.static(__dirname + '/node_modules/angular'));

//app.set('views', __dirname + '/views');
//app.set('view engine', 'angular');

//app.use('/users', users);
//app.use('/maps', users);
var routerhandle = require('./routes/router');

app.use(BASE_HEADER,routerhandle);



//var redis = require('redis');
//var args = [redis_port, redis_host, {auth_pass:redis_pwd}];

//var client = redis.createClient.apply(redis, args);
//client.set('hello','hello,world');

//client.on("error", function (err) {
//    console.log(err);
//});

//client.set('hello','This is a value');
//app.use('/usermapinfo', usermapinfo);
//app.use('/getopenid',openid);

//首页
app.get('/', function (req, res) {
   //res.sendStatus(0);
   res.status=200;
   res.send('Hi,i am liveshow  server');
   console.log('Hi,i am liveshow server');
})


 
 

// catch 404 and forward to error handler
/*
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});*/

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log('err message:',err.message);
  //res.render('error'); 没有设置view,不能使用render函数
});

module.exports = app
