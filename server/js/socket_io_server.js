var clients = [];
var queue = [];
var tcpGuests = [];
var arduinoSocket = null;

var USER_TABLE = 'users';
var PRESENTS_TABLE = 'presents';
var ADMIN_TABLE = 'admin';
var areas = ['lobby','game','finished'];
var passPhrase = 'santaServer';


var http = require("http")
  , net = require('net')
  , url = require('url')
  , fs = require('fs')
  , io = require('socket.io')
  , sys = require(process.binding('natives').util ? 'util' : 'sys')
  , server
  , poolModule = require('generic-pool')
  , requirejs = require('requirejs');
  
requirejs.config({
    //Use node's special variable __dirname to
    //get the directory containing this file.
    //Useful if building a library that will
    //be used in node but does not require the
    //use of node outside
    baseUrl: __dirname,

    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
    nodeRequire: require
}); 

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
    max      : 40,
    idleTimeoutMillis : 30000,
    log : false 
});

//tcp socket server
var tcpServer = net.createServer(function (tcpSocket) {
	arduinoSocket = null;
	console.log('Number of connections on port 8090: ' + tcpServer.connections);
});

tcpServer.on('connection',function(tcpSocket){
	sendHandShake(tcpSocket);
	//tcpSocket.setKeepAlive(true, 100);
	tcpSocket.setTimeout(12000, tcpTimeoutReported());
    
    tcpSocket.on('data',function(data){
    	receiveHandShake(data, function(result){
    		if(result) {
    			var message = data.toString('ascii',0,data.length);
    		
    			arduinoSocket = tcpSocket;
    			tcpSocket.name = "Arduino";
    			tcpSocket.secure = true;
    			//tcpSocket.setKeepAlive(true, 1000);
    			
    			console.log('Passcode received over TCP socket: '+ message);
    			io.sockets.in('game').emit('problem over');
    		}
    		
    		else if(tcpSocket.secure) {
    			var message = data.toString('ascii',0,data.length);
    			
    			if (message.indexOf("ping") != -1) {
    				arduinoSocket.write("pong\r");
    			}
    			
    			else if(message == "pong") {
    			}
    			
    			else if(message.indexOf("pong") != -1) {
					message = message.replace("pong","");
    				console.log('Command completed: '+ message);
    			}
    			
    			else {
    				console.log('Command completed: '+ message);
    			}
    		}
    		
    		else {
    			tcpSocket.destroy();
    		}
    	});
    });
    
    tcpSocket.on('error', function(error){
        console.log(error);
    }); 
    
    tcpSocket.on('close', function(){
    	console.log(tcpSocket.name + ' socket disconnected - Launch Error');
    });
    
    tcpSocket.on('end', function(){
    	if(tcpSocket == arduinoSocket) {
    		arduinoSocket = null;
    	};
    	tcpSocket.destroy();
    	console.log(tcpSocket.name + ' socket disconnected - end');
    });
    
    tcpSocket.on('timeout', function(){
    	if(tcpSocket == arduinoSocket) {
    		arduinoSocket = null;
    	};
    	tcpSocket.destroy();
    });
});

tcpServer.on('close', function(){
	console.log("TCP Server Disconnected");
});

tcpServer.on('end', function(){
	console.log("TCP Server Disconnected");
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

	socket.on('doorman', function(callback, response, dateObject, stateSelector){
		var currentDate = new Date().getTime();
		var currentTimestamp = new Date();
		var currentTime = currentTimestamp.getHours().zeroPad(2) + currentTimestamp.getMinutes().zeroPad(2);
	
		pool.acquire(function(err, client) {
    		if (err) {
    		}
    		else {
        		client.query('select * from ' + ADMIN_TABLE , function(error, results, fields) {
            		if (error) {
        				console.log('Doorman reported error: '+ error);
        				return false;
    				}
    				else {
    					var opening_hour = results[0]['opening_hour'];
    					var opening_hour_ready = opening_hour;
    					opening_hour_ready = opening_hour_ready.substring(0 ,results[0]['opening_hour'].length - 3);
    					opening_hour = opening_hour.substring(0, opening_hour.length - 3).split(":").join("");
    					var closing_hour = results[0]['closing_hour'];
						var closing_hour_ready = closing_hour;
						closing_hour_ready = closing_hour_ready.substring(0 ,results[0]['closing_hour'].length - 3);
    					closing_hour = closing_hour.substring(0, closing_hour.length - 3).split(":").join("");
    					
    					var day_one = new Date(results[0]['day_one']);
    					var day_one_getTime = day_one.getTime();
    					var day_two = new Date(results[0]['day_two']);
    					var day_two_getTime = day_two.getTime();
    					var day_three = new Date(results[0]['day_three']);
    					var day_three_getTime = day_three.getTime()+86340000;
    					var day_three_getTime_raw = day_three.getTime();															
    				
    					if(currentDate >= day_one_getTime && currentDate <= day_three_getTime) {
    						if(currentDate >= day_one_getTime && currentDate < day_two_getTime) {
    							socket.current_day = 1;
    						}
    						
    						else if(currentDate >= day_two_getTime && currentDate < day_three_getTime_raw) {
    							socket.current_day = 2;
    						}
    						
    						else {
    							socket.current_day = 3;
    						}
    					
    						if(currentTime > opening_hour && currentTime < closing_hour) {
    							callback(true,"","","open");
    						}
    						
    						else {
    							if(currentTime > closing_hour) {
    								callback(false, "Competition Still Running, however it's currently closed. Please come back between " + opening_hour_ready + " - " + closing_hour_ready, "","after-opening-hours");
    							}
    							
    							else if(currentTime < closing_hour) {
    								callback(false, "Competition Still Running, however it's currently closed. Please come back between " + opening_hour_ready + " - " + closing_hour_ready, "","before-opening-hours");
    							}
    						}
    					}
    					
    					else if (currentDate < day_one_getTime) {
    						var dates = [];
    						dates.push(day_one);
    						dates.push(day_three);
    					
    						callback(false, "Competition runs from", dates, "pre-open");
    					}
    					
    					else {
    						callback(false, "Competition is now closed.", "","closed");
    					}		
    				}
    				
            		pool.release(client);
        		});
    		}
		});
	});

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
    						socket.first_name = results[0].first_name;
    						socket.last_name = results[0].last_name;
    						socket.full_name = results[0].first_name + " " + results[0].last_name;
    						socket.prize_won = results[0].prize_won;
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
    						var error_code = 1; //User inputed email wrong or it's not in our database.
    						socket.emit('error_messenger', error_code);
    						callback(false);
    					}
            			
            			// return object back to pool
            			pool.release(client);
        			});
    			}
			});
        } else {
        	var error_code = 0; //User already signed in.
    		socket.emit('error_messenger', error_code);
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
    		if(arduinoSocket) {
    			console.log("Instruction Sent: " + instruction);
    			arduinoSocket.write(instruction + "\r");
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
    	
    	else if(action == 'updateQueue') {
    	
    	}
    	
    	else if(action == 'removeFromQueue') {
    		removeFromQueue(socket);
    	}
    });
    
    socket.on("fetch_presents", function(callback, presents) {
    	pool.acquire(function(err, client) {
    		if (err) {
    		}
    		else {
        		client.query('select * from ' + PRESENTS_TABLE, function(error, results, fields) {
            		if (error) {
        				console.log('Error retrieving presents: '+ error);
        				return false;
    				}
    				else {
    					presents = results;
    				
    					callback(true, presents);
    				}
    				
            		pool.release(client);
        		});
    		}
		});
    });
    
    socket.on("fetch_scores", function(callback, score_day_one, score_day_two, score_day_three) {	
    	pool.acquire(function(err, client) {
    		if (err) {
    		}
    		else {
        		client.query('select * from ' + USER_TABLE + ' ORDER BY score_day_1 DESC LIMIT 10', function(error, results, fields) {
            		if (error) {
        				console.log('Error retrieving Top Ten For Day 1: '+ error);
        				return false;
    				}
    				else {
    					score_day_one = results;
    					
    					pool.acquire(function(err, client) {
    						if (err) {
    						}
    						else {
        						client.query('select * from ' + USER_TABLE + ' ORDER BY score_day_2 DESC LIMIT 10', function(error, results, fields) {
            						if (error) {
        								console.log('Error retrieving Top Ten For Day 2: '+ error);
        								return false;
    								}
    								else {
    									score_day_two = results;
    									
    									pool.acquire(function(err, client) {
    										if (err) {
    										}
    										else {
        										client.query('select * from ' + USER_TABLE + ' ORDER BY score_day_3 DESC LIMIT 10', function(error, results, fields) {
            										if (error) {
        												console.log('Error retrieving Top Ten For Day 3: '+ error);
        												return false;
    												}
    												else {
    													score_day_three = results;
    													
    													callback(true, score_day_one, score_day_two, score_day_three);
    												}
    				
            										pool.release(client);
        										});
    										}
										});
    								}
    				
            						pool.release(client);
        						});
    						}
						});
    				}
    				
            		pool.release(client);
        		});
    		}
		});
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
    		if(action.prize_won != true) {
    			queue.push(action.username);
    			callback(true);
    		}
    		else {
    			var error_code = 2; //User has already won a prize.
    			action.emit('error_messenger', error_code);
    			callback(false);
    		}
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

function sendHandShake(socket) {
	socket.write(passPhrase);
}

function receiveHandShake(data, result) {
	if(data.toString('ascii',0,data.length) == passPhrase) {
		result(true);
	}
	
	else {
		result(false);
	}
}

function tcpTimeoutReported() {
	console.log('tcp timeout function called or set.');
}

Number.prototype.zeroPad = function(places) {
	var num = this;
	var zero = places - num.toString().length + 1;
  	return Array(+(zero > 0 && zero)).join("0") + num;
};

Date.prototype.zeroPad = function(places) {
	var num = this;
	var zero = places - num.toString().length + 1;
  	return Array(+(zero > 0 && zero)).join("0") + num;
};