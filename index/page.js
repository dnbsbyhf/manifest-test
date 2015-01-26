



var Util = require("../base/util");

//事件冒泡缓存
var _Cache = {};
var _Debug = false;


function dbg(str){
	_Debug ? console.log(str) : false;
}


function Page(url,debug){
	//初始化url匹配
	this.url = url;
	_Debug = debug;

}

function checkResult(startTime,endTime){
	var  lasting = parseInt(endTime-startTime) ;

	if(typeof lasting == "number" && lasting > 0 && lasting<10000){
		return lasting;
	}else{
		return false;
	}

}


var STATUS = {
	
	BEFOREINIT:"beforeInit",

	AFTERBEFORE:"afterInit"
}


var _page;

Page.prototype.init = function(){
	
	var self =  this;

	var page = self.page = _page = _page || require('webpage').create();

	//准备前
	self.fire(STATUS.BEFOREINIT);

	page.onInitialized = function() {
		dbg("注入js onload事件");
	    page.evaluate(function() {
	    	window.onload = function(){
	    		window.callPhantom(+new Date());
	    	}
	    });
	};
	page.onLoadStarted = function() {
		dbg("开始加载");
	  	self.startTime = +new Date();
	};

	page.onResourceRequested = function(response) {
	  console.log("开始加载资源："+response.url);
	};

	//回调
	self._callback();

	//错误监听
	self.error();

	//触发初始化后事件
	self.fire(STATUS.AFTERBEFORE);

}



Page.prototype.done = function(){
	var self = this;
	self.page.open(self.url,function(status){});	
}

Page.prototype._callback = function(){
	
	var self = this;
	self.page.onCallback = function(data) {
		dbg("抓取结束!");
		self.fire("success",checkResult(self.startTime,data));
	};
}


Page.prototype.error = function(){

	this.page.onError = function(msg, trace) {

	  var msgStack = ['ERROR: ' + msg];

	  if (trace && trace.length) {
	    msgStack.push('TRACE:');
	    trace.forEach(function(t) {
	      msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function +'")' : ''));
	    });
	  }

	  dbg(msgStack.join('\n'));

	};

}


Page.prototype.on = function(type,fn){

	if(!_Cache[type]){
		_Cache[type] = [];
	}

	_Cache[type].push(fn);
	
	return this;
 }



Page.prototype.fire = function(type,data){
	
	var self = this;
	
	var params = _Cache[type] || [];

	if(params.length){

	    for(var index = 0;index < params.length ;index++){
	    	
	    	var item = params[index];

	    	Util.isFunction(item) && (item.call(self,self.page,data));
	   
	    }
	 }
}



module.exports = Page;
