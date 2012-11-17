// LOAD UP THE SERVER
var http = require("http");

function start() {
	function onRequest(request, response) {
  		console.log("Request received");
  		response.writeHead(200, {"Content-Type": "text/plain"});
  		response.write("Hello World!");
  		response.end();
	}

	http.createServer(onRequest).listen(8080, '5.79.16.234');

	console.log('Server running at http://5.79.16.234:8080/');
}

exports.start = start;