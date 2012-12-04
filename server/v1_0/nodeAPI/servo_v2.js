var clients = [];
var tcpGuests = [];


var http = require("http")
  , net = require('net')
  , url = require('url')
  , fs = require('fs')
  , io = require('socket.io')
  , sys = require(process.binding('natives').util ? 'util' : 'sys')
  , server;



var httpServer = http.createServer(function(request, response) {
    fs.readFile(__dirname + "/servo_v2.html", "utf8", function(error, content) {
        response.writeHeader(200, {"Content-Type": "text/html"});
        response.end(content);
    });
}).listen(8080);

var io = require("socket.io").listen(httpServer);

io.sockets.on("connection", function(socket) {

	socket.on('join', function(username, callback) {
        if (clients.indexOf(username) < 0) {
            socket.username = username;
            clients.push(username);
            socket.broadcast.emit("Now Joining: ", username);
            callback(true, clients);
        } else {
            callback(false);
        }
    });
    
    socket.on("chat", function(message) {
        if (socket.username && message) {
            io.sockets.emit("chat", {sender: socket.username, message: message});
        }
    });
    
    socket.on("instructions", function(instruction) {
    	for (g in tcpGuests) {
    		io.sockets.emit("instruction", {instruction: instruction});
        	tcpGuests[g].write(instruction);
    	}
    })
    
	socket.on("disconnect", function() {
        if (socket.username) {
            clients.splice(clients.indexOf(socket.username), 1);
            io.sockets.emit("user-left", socket.username);
        }
    });

});


//tcp socket server
var tcpServer = net.createServer(function (socket) {
	console.log('Created TCP Server, on port 8090.');
	console.log('Number of connections on port 8090: ' + tcpServer.connections);
});

tcpServer.on('connection',function(socket){
    socket.write('Connected to the TCP Server\r\n');
    
    tcpGuests.push(socket);
    
    socket.on('data',function(data){
        
        //send data to guest socket.io chat server
        for (g in io.clients) {
        	console.log('Received over TCP socket: '+data);
        	socket.write('Received Instruction\r\n');
            //var client = io.clients[g];
            client.send({message:["arduino",data.toString('ascii',0,data.length)]}); 
        }
    });
});

tcpServer.listen(8090);
