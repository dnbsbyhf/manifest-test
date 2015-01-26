var webserver = require('webserver');

var server = webserver.create();

var Page = require("./index/page");

var __CONFIG__ = require("./config");

var Util = require('./base/util');


var url = "http://192.168.7.94:2222/cache.html";

var reg = __CONFIG__["filter"];

// console.log("开始抓页面:"+url);

var platform = new Page(url,__CONFIG__.debug);

var count = 1;
var avg = 0;



var die = false;

platform.on('success',function(_page,time){
  if(time){
      // console.log("成功抓取:"+url);

      // console.log((avg = (time-avg)/(count) + avg));
      console.info(time);

      // console.log("第"+count+"次抓取共耗时："+time+"  平均耗时："+(avg = (time-avg)/(count) + avg));

      count++; 
  }

  platform.done();
  
  die = false;
});

var _timer;

platform.init();

platform.done();

// 解决未回调问题
setInterval(function(){
  if(die)
    platform.done();
  die = true;
},3000);