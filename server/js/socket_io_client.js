var connection_state = new server_connection();

$(document).ready(function() {
				
				if(typeof io == 'undefined') {
					$('.server_contact-container').show();
					window.setTimeout('location.reload()', 3000); //reloads after 3 seconds
				} else {
					var socket = io.connect('http://5.79.16.234:8080', {
						'sync disconnect on unload' : true
					});
					$('.server_contact-container').hide();
					$(".entry-form-container").show();
					//connection_state.off;
				}
				
				$('#user-email').val();
				$("#user-email").focus();
                
            	$('.submit-button').click(function(){
            		$(".entry-form").submit();
            	});
                	
                $(".entry-form").submit(function(ev) {
                    ev.preventDefault();
                    var username = $("#user-email").val();
                    if (username) {

                        socket.emit("join", username, function(successful, users) {
                            if (successful) {
                                $(".entry-form-container").hide();
                                $('.servo-container').show();
                                servoRange();
                                
                                /*var message = "Now Joining, " + username;
                                $("#systemMessageTemplate").tmpl({message: message}).appendTo("#messages");

                                $.each(users, function(i, user) {
                                    $("#userTemplate").tmpl({user: user}).appendTo("#users");
                                });*/
                                
                                socket.username = username;
                                
                            } else {
                                $("#user-error").show();
                            }
                        });
                    }
                });
                                
                socket.on("chat", function(message) {
                	$("#chatMessageTemplate").tmpl(message).appendTo("#messages");
                    $("#messages").scrollTop($("#messages").prop("scrollHeight") - $("#messages").height());
                });
                                
                socket.on("user-joined", function(user) {
                	$("#userTemplate").tmpl({user: user}).appendTo("#users");
                    var message ="Now Joining... " + user;
                    $("#systemMessageTemplate").tmpl({message: message}).appendTo("#messages");
                    $("#messages").scrollTop($("#messages").prop("scrollHeight") - $("#messages").height());
                });
                                
                socket.on("user-left", function(user) {
                	$("#user-" + user).remove();
                    var message = user + " left";
                    $("#systemMessageTemplate").tmpl({message: message}).appendTo("#messages");
                    $("#messages").scrollTop($("#messages").prop("scrollHeight") - $("#messages").height());
				});
				
				socket.on('cheat', function(){
					$('.servo-container').hide();
					$('.cheat').show();
				});
				
				socket.on('changeRoom', function(room){
					if(room === 'game') {
						$('.movement-buttons').show();
					}
				});
				
				socket.on('userReady', function(question, answer) {
					if(question === 'lobby->game') {
						$('.queue-buttons').hide();
						
						$('.question-lobby-game').show();
						
						$('.startButton').click(function() {
							$('.question-lobby-game').hide();
							$('span#countdown').simpleCountDownStop();
							answer(true);
						});
						
						$("span#countdown").simpleCountDownStart({
							interval:1000,
							startFrom:10,
							callBack:function(){
								$('.question-lobby-game').hide();
								answer(true);
							}
						});				
					}
				});
                
	$('.movebutton').click(function() {
		socket.emit("instructions", $(this).attr('rel'));
        
        if($(this).attr('rel') === 'left') {
        	servoLeft();
        }
                                	
        else if($(this).attr('rel') === 'reset') {
        	resetServo();
        }
                                	
        else if($(this).attr('rel') === 'right') {
        	servoRight();
        }
	});
	
	$('.join').click(function() {
		socket.emit("queue_controller", 'addToQueue');
	});
	
	$('.leave').click(function() {
		socket.emit('queue_controller', 'removeFromQueue');
	})
	
	$(document).keydown(function(e){
		if( !$('.movement-buttons').is(':visible') ) {
		}
		else {
			if (e.keyCode == 37) { 
       			socket.emit("instructions","left");
       			return false;
    		}
    	
    		else if (e.keyCode == 39) { 
       			socket.emit("instructions","right");
       			return false;
    		}
    	
    		else if (e.keyCode == 32) { 
       			socket.emit("instructions","fire");
       			return false;
    		}
		}
	});

});
