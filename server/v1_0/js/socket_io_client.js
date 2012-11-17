$(document).ready(function() {
            	servoRange();

                $("#username-input").focus();
                var socket = io.connect('http://5.79.16.234:8080');
                
                $("#join-form").submit(function(ev) {
                    ev.preventDefault();
                    var username = $("#username-input").val();
                    if (username) {

                        socket.emit("join", username, function(successful, users) {
                            if (successful) {
                                $("#landing-page").hide();
                                $("#chat").show();
                                $('.button-container').show();
                                
                                resetServo();
                                var message = "Now Joining, " + username;
                                $("#systemMessageTemplate").tmpl({message: message}).appendTo("#messages");

                                $.each(users, function(i, user) {
                                    $("#userTemplate").tmpl({user: user}).appendTo("#users");
                                });
                                
                                $("#message-input").focus();
                                $("#message-form").submit(function(ev) {
                                    ev.preventDefault();
                                    socket.emit("chat", $("#message-input").val());
                                    $("#message-input").val("");
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
                                
                            } else {
                                $("#username-error").show();
                            }
                        });
                    }
                });                
                
            });
