var clients = [];
var queue = [];
var tcpGuests = [];
var arduinoSocket = null;

var USER_TABLE = 'users';
var PRESENTS_TABLE = 'presents';
var ADMIN_TABLE = 'admin';
var areas = ['lobby','game','finished'];
var passPhrase = 'santaServer';

var BALLS_FIRED = 0, RUNNING_SCORE = 0, FINAL_SCORE = 0;

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
    			
    			else if(message.indexOf("score") != -1) {
    				var scoreValueString = message;
    				var scoreValue = str.split(":");
    				var scoreValue = scoreValue[1];
    				console.log(scoreValue);
    				RUNNING_SCORE++;
    				io.sockets.in('game').emit('play_sound', 2); 
    			}
    			
    			else if(message.indexOf("fire") != -1) {
    				BALLS_FIRED++;
    				io.sockets.in('game').emit('play_sound', 1);
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
    io.set('transports', [	'websocket'
  							, 'flashsocket'
  							, 'htmlfile'
  							, 'xhr-polling'
  							, 'jsonp-polling']);
    io.set('flash policy port','10843');
    io.set('flash policy server',true);
});

io.sockets.on("connection", function(socket) {

	socket.on('doorman', function(callback, response, stateSelector, top_3_presents, top_3_scores){
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
    							socket.emit('current_day', 1);
    							var current_day = 1;
    						}
    						
    						else if(currentDate >= day_two_getTime && currentDate < day_three_getTime_raw) {
    							socket.emit('current_day', 2);
    							var current_day = 2;
    						}
    						
    						else {
    							socket.emit('current_day', 3);
    							var current_day = 3;
    						}
    					
    						if(currentTime > opening_hour && currentTime < closing_hour) {
    							callback(true,"","open");
    						}
    						
    						else {
    							if(currentTime > closing_hour) {
    								pool.acquire(function(err, client) {
    								if (err) {
    									console.log(err);
    								}
    								else {
        								client.query('select * from ' + PRESENTS_TABLE + ' where day_available = ?', [ current_day ], function(error, top_3_presents, fields) {
            						if (error) {
        								console.log('Error retrieving presents: '+ error);
        								return false;
    								}
    								else {
    				
    									pool.acquire(function(err, client) {
    									if (err) {
    										console.log(err);
    									}
    									else {
        									client.query('select * from ' + USER_TABLE + ' ORDER BY score_day_' + current_day + ' DESC LIMIT 3', function(error, top_3_scores, fields) {
            									if (error) {
        											console.log('Error retrieving presents: '+ error);
        											return false;
    											}
    											else {
    												if(current_day != 3) {
    													callback(false, "Come back tomorrow between " + opening_hour_ready + " and " + closing_hour_ready + " for the next game!","after-opening-hours", top_3_presents, top_3_scores);
    												}
    								
    												else {
    													callback(false, "The games are over for this year but come back next year to see what fun we have created for you!",'after-opening-hours', top_3_presents, top_3_scores);
    												}
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
    							
    							else if(currentTime < opening_hour) {
    								callback(false, "We're not open for play just yet.<br />Please come back between " + opening_hour_ready + " - " + closing_hour_ready,"before-opening-hours");
    							}
    						}
    					}
    					
    					else if (currentDate < day_one_getTime) {
    						var dates = [];
    						dates.push(day_one);
    						dates.push(day_three);
    					
    						callback(false, "Starting" + " " + day_one.getDayName() + " " + day_one.getDate().getOrdinal() + " " + day_one.getMonthName() + " - " + day_three.getDayName() + " " + day_three.getDate().getOrdinal() + " " + day_three.getMonthName(), "pre-open");
    					}
    					
    					else {
    						callback(
    							  false
    							, "The games are over for this year but come back next year to see what fun we have created for you!"
    							,"closed"
    						);
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
    
    
    socket.on('queue_controller', function(action, callback, queuePosition) {
    	if(action == 'addToQueue') {
    		addToQueue(socket, function(result) {   
    			if(result == true) {
    				if(objectLength(io.sockets.clients('game')) === 0 && getPosition(queue, socket.username) == 0) {
    					gameStart(socket, 'lobby->game', function(ready){
    						if(ready) {
    							resetScores();
    							changeRoom(socket, 'game', function(result){
    								if(result){
    									socket.emit('changeRoom', 'game');
    								}
    							});
    						}
    					});
    					callback(true);
    				}
    				
    				else {
    					callback(false, getPosition(queue, socket.username).zeroPad(2));
    				}
    			}
    			
    			else {
    				
    			} 
			});  
    	}
    	
    	else if(action == 'updateQueue') {
    	
    	}
    	
    	else if(action == 'removeFromQueue') {
    		removeFromQueue(socket, function(removed){
    			if(removed){
    				callback(true);
    			}
    		});
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
        		client.query('select * from ' + USER_TABLE + ' ORDER BY score_day_1 DESC LIMIT 10', function(error, score_day_one, fields) {
            		if (error) {
        				console.log('Error retrieving Top Ten For Day 1: '+ error);
        				return false;
    				}
    				else {
    					pool.acquire(function(err, client) {
    						if (err) {
    						}
    						else {
        						client.query('select * from ' + USER_TABLE + ' ORDER BY score_day_2 DESC LIMIT 10', function(error, score_day_two, fields) {
            						if (error) {
        								console.log('Error retrieving Top Ten For Day 2: '+ error);
        								return false;
    								}
    								else {
    									pool.acquire(function(err, client) {
    										if (err) {
    										}
    										else {
        										client.query('select * from ' + USER_TABLE + ' ORDER BY score_day_3 DESC LIMIT 10', function(error, score_day_three, fields) {
            										if (error) {
        												console.log('Error retrieving Top Ten For Day 3: '+ error);
        												return false;
    												}
    												else {
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
    
    socket.on('gameOver', function(callback, ballsFired, finalScore, userHighestScore, currentPosition){
    	changeRoom(socket, 'finished', function(result){
    		if(result){
    			console.log(socket.username);
    			//socket.emit('changeRoom', 'finished');
    		}
    	});
    });
    
	socket.on("disconnect", function() {
        if (socket.username) {
            clients.splice(clients.indexOf(socket.username), 1);
            socket.leave(socket.room);
            removeFromQueue(socket, function(removed){
            	updateQueue(socket);
            });
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
		resetScores();
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
    
function removeFromQueue(action, callback) {
	if(queue.indexOf(action.username) >= 0) {
    	queue.splice(queue.indexOf(action.username), 1);
    	callback(true);
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

function resetScores() {
	var BALLS_FIRED = 0, RUNNING_SCORE = 0, FINAL_SCORE = 0;
};

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

Date.prototype.monthNames = [
    "January", "February", "March",
    "April", "May", "June",
    "July", "August", "September",
    "October", "November", "December"
];

Date.prototype.dayNames = [
	"Monday", "Tuesday", "Wednesday",
	"Thursday", "Friday", "Saturday",
	"Sunday"
];

Number.prototype.getOrdinal = function()
{
var n = this % 100;
var suff = ["th", "st", "nd", "rd", "th"]; // suff for suffix
var ord= n<21?(n<4 ? suff[n]:suff[0]): (n%10>4 ? suff[0] : suff[n%10]);
return this + ord;
}

Date.prototype.getMonthName = function() {
    return this.monthNames[this.getMonth()];
};
Date.prototype.getShortMonthName = function () {
    return this.getMonthName().substr(0, 3);
};

Date.prototype.getDayName = function() {
	return this.dayNames[this.getDay()];
}