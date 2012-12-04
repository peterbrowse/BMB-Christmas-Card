var clients = [];
var queue = [];
var tcpGuests = [];

var USER_TABLE = 'users';
var areas = ['lobby','game','finished'];
var held = false


var http = require("http")
  , net = require('net')
  , url = require('url')
  , fs = require('fs')
  , io = require('socket.io')
  , sys = require(process.binding('natives').util ? 'util' : 'sys')
  , server
  , poolModule = require('generic-pool');

var httpServer = http.createServer(function(request, response) {
    fs.readFile(__dirname + "/index.html", "utf8", function(error, content) {
        response.writeHeader(200, {"Content-Type": "text/html"});
        response.end(content);
    });
}).listen(8080);

var pool = poolModule.Pool({
    name     : 'mysql',
    create   : function(callback) {
        var mysql = require('mysql');
		var connection = mysql.createConnection({
  			host     : 'localhost',
  			user     : 'xmas_users',
  			password : 'christmascard2012',
  			database : 'xmas_users'
		});
        
        callback(null, connection);
    },
    destroy  : function(client) { client.end(); },
    max      : 20,
    idleTimeoutMillis : 30000,
    log : false 
});

//tcp socket server
var tcpServer = net.createServer(function (tcpSocket) {
	console.log('Created TCP Server, on port 8090.');
	console.log('Number of connections on port 8090: ' + tcpServer.connections);
});

tcpServer.on('connection',function(tcpSocket){
    tcpSocket.write('Connected to the TCP Server\r\n');
    tcpGuests.push(tcpSocket);
    tcpSocket.on('data',function(data){
    	
    
        //send data to guest socket.io chat server
        for (g in io.clients) {
        	console.log('Received over TCP socket: '+data);
        	tcpSocket.write('Received Instruction\r\n');
            //var client = io.clients[g];
            client.send({message:["arduino",data.toString('ascii',0,data.length)]}); 
        }
    });
    
    tcpSocket.on('error', function(error){
        console.log(error);
    });    
}).on('end',function(tcpSocket) {

}).on('disconnect', function(tcpSocket){
	tcpGuests.unshift(tcpSoc)
});

tcpServer.listen(8090);

var io = require("socket.io").listen(httpServer);

io.configure(function(){
    io.set('log level', 3);
    io.set('transports', ['websocket', 'xhr-polling']); //in production switch to XHR only in case memory leaks appearing all the time.
    io.set('sync disconnect on unload', true);
    io.set('flash policy port','10843');
    io.set('flash policy server',true);
});

io.sockets.on("connection", function(socket) {

	socket.on('join', function(username, callback) {
		var lobbyUsers = objectLength(io.sockets.clients('lobby'));
		var gameUsers = objectLength(io.sockets.clients('game'));
		var finishedUsers = objectLength(io.sockets.clients('finished'));
		
		if(lobbyUsers == 0 && gameUsers == 0 && finishedUsers == 0) {
			clients = [];
		}
	
        if (clients.indexOf(username) < 0) {
            pool.acquire(function(err, client) {
    			if (err) {
        			// handle error - this is generally the err from your
        			// factory.create function  
    			}
    			else {
        			client.query('select * from ' + USER_TABLE + ' where email_address = ?', [ username ], function(error, results, fields) {
            			if (error) {
        					console.log('ERROR CHECKING IF USER EXISTS IN ' + USER_TABLE + ' TABLE: '+ error);
        						return false;
    					}
    					
    					if (results.length  > 0) {
    						socket.username = username;
    						socket.room = 'lobby';
    						var fullName = results[0].first_name + " " + results[0].last_name;
    						socket.first_name = results[0].first_name;
    						socket.last_name = results[0].last_name;
    						socket.full_name = fullName;
    						clients.push(username);
    						socket.join('lobby');
    						//socket.broadcast.emit("now joining: ", fullName);
    						pool.acquire(function(err, client) {
    							if (err) {
        							// handle error - this is generally the err from your
        							// factory.create function  
    							}
    							else {
        							client.query('UPDATE ' + USER_TABLE + ' SET last_login = CURRENT_TIMESTAMP WHERE email_address = ?', [ username ], function(error) {
            							if (error) {
        									console.log('ERROR UPDATING LAST_LOGIN TIMESTAMP: '+ error);
        									return false;
    									}
            							pool.release(client);
        							});
    							}
							});
    						callback(true, clients);
    					} else {
    						callback(false);
    					}
            			
            			// return object back to pool
            			pool.release(client);
        			});
    			}
			});
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
    	if(socket.room === "game") {
    		for (g in tcpGuests) {
    		io.sockets.emit("instruction", {instruction: instruction});
        	tcpGuests[g].write(instruction);
    		}
    	}
    	
    	else {
    		socket.emit('cheat', function(){});
    		socket.disconnect();
    	}
    })
    
    
    socket.on('queue_controller', function(action) {
    	if(action == 'addToQueue') {
    		addToQueue(socket, function(result) {   
    			if(result) {
    				if(objectLength(io.sockets.clients('game')) === 0 && getPosition(queue, socket.username) == 0) {
    					gameStart(socket, 'lobby->game', function(ready){
    						if(ready) {
    							changeRoom(socket, 'game', function(result){
    								if(result){
    									socket.emit('changeRoom', 'game');
    								}
    							});
    						}
    					});
    				}
    			}  
			});  
    	}
    	
    	else if(action == 'removeFromQueue') {
    		removeFromQueue(socket);
    	}
    });
    
	socket.on("disconnect", function() {
        if (socket.username) {
            clients.splice(clients.indexOf(socket.username), 1);
            socket.broadcast.emit("user-left", socket.full_name);
            socket.leave(socket.room);
            removeFromQueue(socket);
            updateQueue(socket);
        }
    });
});


io.sockets.on("disconnect", function(socket) {
	pool.drain(function() {
    	pool.destroyAllNow();
	});
});


/* FUNCTIONS */

function addToQueue(action, callback) {
    if(queue.indexOf(action.username) != 1) {
    	if(queue.indexOf(action.username) < 0) {
    		queue.push(action.username);
    		//console.log(action.full_name + " added to queue.");
    		callback(true);
    	}
    }
}

function gameStart(socket, question, callback) {
	socket.emit('userReady', question, function(answer) {
		callback(true);
	});
}

function changeRoom(socket, newRoom, callback) {
	socket.leave(socket.room);
	socket.room = newRoom;
	socket.join(newRoom);
	
	if(callback){
		callback(true);
	}
}


function updateQueue(socket) {
};
    
function removeFromQueue(action) {
	if(queue.indexOf(action.username) >= 0) {
    	queue.splice(queue.indexOf(action.username), 1);
    	//console.log(action.full_name + " removed from queue.");
    }
}

function objectLength(obj) {
  var result = 0;
  for(var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      result++;
    }
  }
  return result;
}

function getPosition(arrayName,arrayItem)
{
  for(var i=0;i<arrayName.length;i++){ 
   if(arrayName[i]==arrayItem)
  return i;
  }
}