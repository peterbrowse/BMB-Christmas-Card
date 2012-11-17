function server_connection() {}

server_connection.prototype.on = function () {
	$('.server_contact-container').hide();
	$(".entry-form-container").show();
}

server_connection.prototype.off = function () {
	$('.server_contact-container').show();
	$(".entry-form-container").hide();
} 

