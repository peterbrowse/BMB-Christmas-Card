var net = require("net");

exports.start = function () {
	
	var server = net.createServer(function (socket){
		console.log("Server Connected");
  		socket.write("left");
  		//socket.end();
  		
  		// RECIEVING DATA
  		socket.on('data', function(data) {
        	console.log(data);
    	});
    	
    	// ON END
    	socket.on("end", function() {
    		console.log("server disconnected");
  		});
	});
	
	server.listen(8080, function() {
  		console.log("Server Bound");
	});
}

exports.right = function () {
	console.log("Right Called in server.js");
}

exports.left = function () {
	console.log("Left Called in server.js");
}