/*
 * @Author: xiuquanxu
 * @Company: kaochong
 * @Date: 2020-04-04 18:01:38
 * @LastEditors: xiuquanxu
 * @LastEditTime: 2020-04-05 00:27:25
 */
var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var path = require('path');

app.listen(8085, function() {
  console.log('server start success, port:8085');
});

function handler (req, res) {
  const reqPath = req.url;
  const recorderPlayerPath = path.resolve(__dirname, '../');
  fs.readFile(recorderPlayerPath + reqPath,
  function (err, data) {
    console.log('path:', recorderPlayerPath + reqPath);
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.on('connection', function (socket) {
  var socketId = socket.id;
  console.log(socketId);
  socket.on('pcm-data', function (data) {
    // console.log('server receive data:', data);
    // io.on('connection',function(socket){});//建立连接
    // io.sockets.emit(约定参数，data)；//向全体人员广播
    // io.emit(约定参数, data);//向全体人员广播
    // socket.emit(约定参数，data)//发送信息
    // socket.on(约定参数，callback）；//接收信息
    // socket.on('disconnect',callback);//用户断开连接触发事件
    console.log(data.pcm.length);
    socket.broadcast.emit('to-player', data.pcm);
  });
});