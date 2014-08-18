var WebSocketServer = require("ws").Server
var http = require("http")
var express = require("express")
var app = express()
var port = process.env.PORT || 5000

app.use(express.static(__dirname + "/"))

var server = http.createServer(app)
server.listen(port)

console.log("http server listening on %d", port)

var wss = new WebSocketServer({server: server})
console.log("websocket server created")

// 接続の保持
var connections = [];

wss.on("connection", function(ws) {
  connections.push(ws); 
  console.log("websocket connection open")
  
  ws.on("message", function(message) {
    console.log('recived: %s', message);
    now = new Date();
    var data = [];
    var datetime = now.getFullYear() + "/" + now.getMonth() + "/" + now.getDay() + " " + now.getMinutes() + ":" + now.getSeconds() + ":" + now.getMilliseconds();
    data = {"message": message, "date": datetime};
    broadcast(JSON.stringify(data));
  });
  
  ws.on("close", function() {
    console.log("websocket connection close")
    connections = connections.filter(function(conn, i) {
      return (conn == ws) ? false : true;
    });
  })
})

function broadcast(message) {
  connections.forEach(function(con, i) {
    con.send(message);
  });
}
