$(document).ready(function() {
				loading_screen('connecting');
				
				if(typeof io == 'undefined') {
					$('.server_contact-container').show();
					window.setTimeout('location.reload()', 3000); //reloads after 3 seconds
				}
				
				var socket = io.connect('http://5.79.16.234:8080', {
						'sync disconnect on unload' : true,
  						'connect timeout': 3000
				});
				
				socket.on('connect_failed', function(){
					$('.server_contact-container').show();
					window.setTimeout('location.reload()', 3000);
				});
				
				socket.on('error',function(error){
					$('.server_contact-container').show();
					window.setTimeout('location.reload()', 3000);
				});
				
				socket.on('connect',function(){
					loading_screen('loading');
					$([
					 '/images/interface/arrow_left.png'
					,'/images/interface/arrow_left.png'
					,'/images/interface/audio_off.png'
					,'/images/interface/audio_on.png'
					,'/images/interface/banner_fold.png'
					,'/images/interface/banner_front.png'
					,'/images/interface/bg_blue.png'
					,'/images/interface/bg_green.png'
					,'/images/interface/bg_orange.png'
					,'/images/interface/bg_purple.png'
					,'/images/interface/bg_red.png'
					,'/images/interface/blue_button_sprite.png'
					,'/images/interface/closed_banner.png'
					,'/images/interface/connecting_screen.png'
					,'/images/interface/corner_left_blue.png'
					,'/images/interface/corner_left_bottom_white.png'
					,'/images/interface/corner_left_green.png'
					,'/images/interface/corner_left_red.png'
					,'/images/interface/corner_left_top_white.png'
					,'/images/interface/corner_left_white.png'
					,'/images/interface/corner_right_blue.png'
					,'/images/interface/corner_right_bottom_white.png'
					,'/images/interface/corner_right_red.png'
					,'/images/interface/corner_right_top_white.png'
					,'/images/interface/corner_right_white.png'
					,'/images/interface/counter_letsbegin.png'
					,'/images/interface/counter1.png'
					,'/images/interface/counter2.png'
					,'/images/interface/counter3.png'
					,'/images/interface/counter4.png'
					,'/images/interface/counter5.png'
					,'/images/interface/counter6.png'
					,'/images/interface/cross_hairs.png'
					,'/images/interface/crosshair_button_graphic.png'
					,'/images/interface/enthusiastic_penguin.png'
					,'/images/interface/gameover_santa.png'
					,'/images/interface/icy_hexagon.png'
					,'/images/interface/loading_kid.png'
					,'/images/interface/loading_screen.png'
					,'/images/interface/off_white_hexagon.png'
					,'/images/interface/plus_symbol.png'
					,'/images/interface/polar_flash.png'
					,'/images/interface/prize_winner_hexagon.png'
					,'/images/interface/queue_message1.png'
					,'/images/interface/queue_message2.png'
					,'/images/interface/raygun_big.png'
					,'/images/interface/raygun_small_grey.png'
					,'/images/interface/red_button_sprite.png'
					,'/images/interface/red_hexagon.png'
					,'/images/interface/rudolf_phone.png'
					,'/images/interface/sprout_shooter_logo.png'
					,'/images/interface/sprout.png'
					]).preloadImages(function(){
						loading_screen('done');
					});
					socket.emit('doorman', function(callback, response, dateObject, stateSelector) {
						if(callback) {
							$('.server_contact-container').hide();
							$(".entry-form-container").show();
							
							/* START OF PRODUCTION SCOPE */
							/* END OF PRODUCTION SCOPE */
						}
						
						else {
							if(dateObject) {
								var day_one = new Date(dateObject[0]);
								var day_three = new Date(dateObject[1]);
								
								alert("Launch Error handler with the following response: " + response + " " + day_one.getDayName() + " " + day_one.getDate().getOrdinal() + " " + day_one.getMonthName() + " - " + day_three.getDayName() + " " + day_three.getDate().getOrdinal() + " " + day_three.getMonthName());
							}
						
							else {
								alert("Launch Error handler with the following response: " + response);
							}
						}
					});
					
					socket.emit('fetch_presents', function(callback, presents) { 
						if(callback) {
							for (var i=0;i<9;i++){
								$target = $('.prize-grid li').eq(i); 
								$target.text(presents[i]['present_name']).removeClass('unset');
							
								if(presents[i]['prize_level'] == '1') {
									$target.addClass('prize_one');
								}
									
								else if(presents[i]['prize_level'] == '2') {
									$target.addClass('prize_two');
								}
									
								else if(presents[i]['prize_level'] == '3') {
									$target.addClass('prize_three');
								}
								
								if(presents[i]['won']) {
									if(presents[i]['prize_level'] == '1') {
										$target.addClass('won_one');
									}
									
									else if(presents[i]['prize_level'] == '2') {
										$target.addClass('won_two');
									}
									
									else if(presents[i]['prize_level'] == '3') {
										$target.addClass('won_three');
									}
								}
							}
						}
					});
					
					socket.emit('fetch_scores', function(callback, score_day_one, score_day_two, score_day_three) {
						if(callback) {
							for(var i=0;i<10;i++) {
								var $target1 = $('.card-one .card-inner div.score-item').eq(i);
								var $target2 = $('.card-two .card-inner div.score-item').eq(i);
								var $target3 = $('.card-three .card-inner div.score-item').eq(i);
							
								if(score_day_one[i]) {
									var $detailString = score_day_one[i]['first_name'] + "/" + score_day_one[i]['client'];
									var $scoreString = score_day_one[i]['score_day_1'];
									if($scoreString != '0') {
										$scoreString = $scoreString.zeroPad(6);
										$target1.find('li.user-details').text($detailString);
										$target1.find('li.user-score').text($scoreString);
									}
								}
								
								if(score_day_two[i]) {
									var $detailString = score_day_two[i]['first_name'] + "/" + score_day_two[i]['client'];
									var $scoreString = score_day_two[i]['score_day_2'];
									if($scoreString != '0') {
										$scoreString = $scoreString.zeroPad(6);
										$target2.find('li.user-details').text($detailString);
										$target2.find('li.user-score').text($scoreString);
									}
								}
								
								if(score_day_three[i]) {
									var $detailString = score_day_three[i]['first_name'] + "/" + score_day_three[i]['client'];
									var $scoreString = score_day_three[i]['score_day_3'];
									if($scoreString != '0') {
										$scoreString = $scoreString.zeroPad(6);
										$target3.find('li.user-details').text($detailString);
										$target3.find('li.user-score').text($scoreString);
									}
								}
							}
						}
					});
				});
				
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
				
				socket.on('receive_scores', function(score_day_one, score_day_two, score_day_three){
					for(var i=0;i<10;i++) {
						var $target1 = $('.card-one .card-inner div.score-item').eq(i);
						var $target2 = $('.card-two .card-inner div.score-item').eq(i);
						var $target3 = $('.card-three .card-inner div.score-item').eq(i);
						
						if(score_day_one[i]) {
							var $detailString = score_day_one[i]['first_name'] + "/" + score_day_one[i]['client'];
							var $scoreString = score_day_one[i]['score_day_1'];
							if($scoreString != '0') {
								$scoreString = $scoreString.zeroPad(6);
								$target1.find('li.user-details').text($detailString);
								$target1.find('li.user-score').text($scoreString);
							}
						}
								
						if(score_day_two[i]) {
							var $detailString = score_day_two[i]['first_name'] + "/" + score_day_two[i]['client'];
							var $scoreString = score_day_two[i]['score_day_2'];
							if($scoreString != '0') {
								$scoreString = $scoreString.zeroPad(6);
								$target2.find('li.user-details').text($detailString);
								$target2.find('li.user-score').text($scoreString);
							}
						}
								
						if(score_day_three[i]) {
							var $detailString = score_day_three[i]['first_name'] + "/" + score_day_three[i]['client'];
							var $scoreString = score_day_three[i]['score_day_3'];
							if($scoreString != '0') {
								$scoreString = $scoreString.zeroPad(6);
								$target3.find('li.user-details').text($detailString);
								$target3.find('li.user-score').text($scoreString);
							}
						}
					}
				});
				
				socket.on('error_messenger', function(error_code){
					switch (error_code)
					{
						case 0:
  							error_message="I'm sorry, the address you entered is already signed in, if this is not the case, please contact your BMB account team to report an issue.";
  							break;
						case 1:
 							error_message="The email address you entered is either wrong or not in our client database, please contact your BMB account team to report an issue or get yourself registered for the game.";
  							break;
						case 2:
 							error_message="You've already won a prize, sit back and enjoy the show.";
  							break;
					}
					
					alert(error_message);
				});
				
				socket.on('disconnect',function() {
					alert('Launch server disconnect');
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
					if(e.keyCode == 32) {
						e.preventDefault();
					}
				
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
					
					if(e.keyCode == 27){
            			return false;
       				}
				});

});
