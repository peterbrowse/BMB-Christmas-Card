// LOAD UP THE SERVER
var http = require("http");

function start() {
	function onRequest(request, response) {
  		console.log("Request received.");
  		response.writeHead(200, {"Content-Type": "text/plain"});
  		response.write("Hello World");
  		response.end();
	}

	http.createServer(onRequest).listen(1337, '127.0.0.1');

	console.log('Server running at http://127.0.0.1:1337/');
}

exports.start = start;