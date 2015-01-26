/**
 * 创建一个对nginx的门面
 */
var childProcess = require('child_process'),
    fork = childProcess.fork,
    spawn = childProcess.spawn,
    exec = childProcess.exec,
    date = function(){
        return (new Date());
    },
    fs = require("fs");
    cluster = require('cluster');

var numWks = 15;

if (cluster.isMaster) {
    // 清空数据
    console.log("清空之前数据")
    fs.writeFileSync(__dirname + '/log/baidu.log',"");

    //创建集群
    for (var i = 0; i < numWks; i++) {
        cluster.fork();
    }
    console.info('['+date().getTime()+'] '+numWks+' worker(s) dispatched');
    cluster.on('exit', function(worker, code, signal) {
        console.info('['+date().getTime()+'] worker ' + worker.process.pid + ' died.');
    });

    cluster.on('online', function(worker, code, signal) {
        console.info('['+date().getTime()+'] worker ' + worker.process.pid + ' is now serving.');
    });
} else {
    console.log(__dirname + '/../app.js');
    crawl = spawn('phantomjs',[__dirname + '/app.js']);
    crawl.stdout.setEncoding('utf8');
    crawl.stdout.on('data', function(data) {
        var data = parseInt(data);
        console.info(data);
        if(typeof data == "number")
            fs.appendFileSync(__dirname + '/log/baidu.log',data+",");
    });
}