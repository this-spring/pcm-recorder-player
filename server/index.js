/*
 * @Author: xiuquanxu
 * @Company: kaochong
 * @Date: 2020-04-04 18:01:38
 * @LastEditors: xiuquanxu
 * @LastEditTime: 2020-04-04 22:54:42
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
  socket.on('pcm-data', function (data) {
    console.log('server receive data:', data);
    socket.broadcast.emit('to-player', data.pcm);
  });
});