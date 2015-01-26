var fs = require("fs");

var cnt = fs.readFileSync(__dirname + '/log/cache.log',{encoding:"UTF-8"}).split(",");

cnt.splice(cnt.length-1,1);

var avg = 0;
var count = 1;
cnt.forEach(function(item){
	if(item){
		avg = (item - avg)/(count) + avg;
		count++;
	}
})

console.log("共收集"+count+"次有效数据；平均加载时间为："+parseInt(avg)+"ms");