<!DOCTYPE html>
<html>
	<head>
        <title>BMB Christmas Card 2012/13</title>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=0" />
		<link href="/images/favicon.ico" type="image/x-icon" rel="shortcut icon">
         
    	<script type="text/javascript" src="http://code.jquery.com/jquery-latest.min.js"></script>
    	<script type="text/javascript" src="http://code.jquery.com/ui/1.9.2/jquery-ui.js"></script>
		<script type="text/javascript" src="http://ajax.microsoft.com/ajax/jquery.templates/beta1/jquery.tmpl.min.js"></script>
		<script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.0.rc.1/handlebars.min.js"></script>
		<script type="text/javascript" src="http://5.79.16.234:8080/socket.io/socket.io.js"></script>
		<script type="text/javascript" src="js/jquerymx-3.2.custom.min.js"></script>
		<script type="text/javascript" src="js/jquery.jplayer.min.js"></script>
		<script type="text/javascript" src="js/jquery.preloader.js"></script>
		<script type="text/javascript" src="swfobject.js"></script>
		<script type="text/javascript" src="js/function.js?v=<?php echo filemtime('js/function.js')?>"></script>
		<script type="text/javascript" src="js/jquery.cycle.all.js?v=<?php echo filemtime('js/jquery.cycle.all.js')?>"></script>
		<script type="text/javascript" src="js/socket_io_client.js?v=<?php echo filemtime('js/socket_io_client.js')?>"></script>
		<script type="text/javascript" src="js/nested_functions/timer.js?v=<?php echo filemtime('js/nested_functions/timer.js')?>"></script>
		<script type="text/javascript" src="js/states.js?v=<?php echo filemtime('js/states.js')?>"></script>
		
        <link rel="stylesheet" href="css/MyFontsWebfontsKit.css" type="text/css" />
		<link rel="stylesheet" href="css/base-reset.css?v=<?php echo filemtime('css/base-reset.css')?>" type="text/css" />
        <link rel="stylesheet" href="css/general.css?v=<?php echo filemtime('css/general.css')?>" type="text/css" />
        <link rel="stylesheet" href="css/typography.css?v=<?php echo filemtime('css/typography.css')?>" type="text/css" />
        <link rel="stylesheet" href="css/states.css?v=<?php echo filemtime('css/states.css')?>" type="text/css" />
        
        <script type="text/javascript" src="js/respond.src.js?v=<?php echo filemtime('js/respond.src.js')?>"></script>
	</head>
    <body>
    	<audio src="/audio/Sleigh-Ride.mp3" preload="auto"></audio>
    	<div class="container">
    		<div class="header-container">
    			<div class="main-logo">
    				<a href="http://www.bmbagency.com/" target="_blank"><img src="/images/general/BMB_logo.png" alt="BMB Logo" /></a>
    			</div>
    			<div class="view-container">
    				<div class="scene-outter">
    					<div class="scene-container">
    					</div>
    					<script class="doorman-template" type = "text/x-handlebars-template">
    						<div class="view {{className}}{{#if bgColour}} {{bgColour}}-bg{{/if}}">
    							{{{content}}}
    						</div>
    					</script>
    					<script class="connecting-template" type="text/x-handlebars-template">
    						<div class="view {{className}}{{#if bgColour}} {{bgColour}}-bg{{/if}}">
    							<div class="loading-kid">
    								<p>{{{randColour message}}}</p>
    							</div>
    						</div>
    					</script>
    					<script class="login-template" type="text/x-handlebars-template">
    						<div class="view {{className}}{{#if bgColour}} {{bgColour}}-bg{{/if}}">
    								{{{content}}}
    						</div>
    					</script>
    					
    					<script class="audio-template" type="text/x-handlebars-template">
    						<div class="music-container">
    							<p>On/Off</p>
    						</div>
    					</script>
    					<script class="lobby-template" type="text/x-handebars-template">
    						<div class="view lobby none-bg">
    							<div class="global-help-button">
    								<p>Help!</p>
    								<img src="/images/interface/corner_left_red.png" />
    							</div>
    							<div class="global-help blue-bg">
    								<div class="global-close-button">
    									<p>Close</p>
    									<img src="/images/interface/corner_left_white.png" />
    								</div>
    								<div class="global-logout-white-button">
    									<img src="/images/interface/corner_right_white.png" />
    									<p>Log Out</p>
    								</div>
    								<div class="global-help-content">
    									<p class="global-help-intro">You have 60 seconds to score as 
many points as possible!</p>
										<div class="help-text-arrows">
											<img src="/images/instructions/arrow_keys.png" />
											<p>Use the directional arrows on your keyboard 
to aim your sprouts before you...</p>
										</div>
										<img src="/images/interface/plus_symbol.png" class="help-text-plus" />
										<div class="help-text-spacebar">
											<img src="/images/instructions/spacebar.png" />
											<p>...Hit the space bar to SHOOT!</p>
										</div>			
										<a href="mailto:santa@bmbagency.com" class="mailtoSanta-button">santa@bmbagency.com</a>
    								</div>
    							</div>
    							<div class="global-blue-top-bar">
    								<img class="panels" src="/images/interface/corner_left_blue.png" />
    								<div class="barContent">
    									<div class="barContentTextHolder"><p>Click here to get started!</p></div>
    								</div>
    								<img class="panels" src="/images/interface/corner_right_blue.png" />
    							</div>
    							<div class="global-logout-button">
    								<img src="/images/interface/corner_right_red.png" />
    								<p>Log Out</p>
    							</div>
    						</div>
    					</script>
    					<script class="userReady-template" type="text/x-handebars-template">
    						<div class="view lobby clear-bg">
    							<div class="global-help-button">
    								<p>Help!</p>
    								<img src="/images/interface/corner_left_red.png" />
    							</div>
    							<div class="global-help blue-bg">
    								<div class="global-close-button">
    									<p>Close</p>
    									<img src="/images/interface/corner_left_white.png" />
    								</div>
    								<div class="global-logout-white-button">
    									<img src="/images/interface/corner_right_white.png" />
    									<p>Log Out</p>
    								</div>
    								<div class="global-help-content">
    									<p class="global-help-intro">You have 60 seconds to score as 
many points as possible!</p>
										<div class="help-text-arrows">
											<img src="/images/instructions/arrow_keys.png" />
											<p>Use the directional arrows on your keyboard 
to aim your sprouts before you...</p>
										</div>
										<img src="/images/interface/plus_symbol.png" class="help-text-plus" />
										<div class="help-text-spacebar">
											<img src="/images/instructions/spacebar.png" />
											<p>...Hit the space bar to SHOOT!</p>
										</div>			
										<a href="mailto:santa@bmbagency.com" class="mailtoSanta-button">santa@bmbagency.com</a>
    								</div>
    							</div>
    							<div class="global-logout-button">
    								<img src="/images/interface/corner_right_red.png" />
    								<p>Log Out</p>
    							</div>
								<div class="countdown-hexagon">
									<p class="countdown-message">Ready to play</p>
									<img src="/images/interface/counter1.png" class="hex-counter-1" />
									<img src="/images/interface/counter2.png" class="hex-counter-2" />
									<img src="/images/interface/counter3.png" class="hex-counter-3" />
									<img src="/images/interface/counter4.png" class="hex-counter-4" />
									<img src="/images/interface/counter5.png" class="hex-counter-5" />
									<img src="/images/interface/counter6.png" class="hex-counter-6" />
									
									<div class="lets-begin">
										<img src="/images/interface/counter_letsbegin.png" />
										<p>Go!</p>
									</div>
								</div>
								
								<div class="target-scroller">
									<ul class="target-scroller-items">
										<li>
											<img src="/images/instructions/Targets/kid.png">
											<span>= 25 points</span>
										</li>
										<li>
											<img src="/images/instructions/Targets/snowman.png">
											<span>= 50 points</span>
										</li>
										<li>
											<img src="/images/instructions/Targets/rudolf.png">
											<span>= 75 points</span>
										</li>
										<li>
											<img src="/images/instructions/Targets/santa.png">
											<span>= 100 points</span>
										</li>
										<li>
											<img src="/images/instructions/Targets/nutcracker.png">
											<span>= 125 points</span>
										</li>
										<li>
											<img src="/images/instructions/Targets/polar.png">
											<span>= 150 points</span>
										</li>
									</ul>
								</div>
    						</div>
    					</script>
    					<div class="music-file"></div>
    					<div class="fire-file"></div>
    					<div class="score-file"></div>
    					<div class="bell-file"></div>
    				</div>
    			</div>
    			<div class="menu-container">
    				<div class="menu-container-inner">
    					<ul>
    						<li>About</li>
    						<li>Prizes</li>
    						<li>Instructions</li>
    						<li>Leaderboard</li>
    					</ul>
    				</div>
    			</div>
    		</div>
    		<div class="section about">
    			<div class="section-header">
    				<img src="/images/about/HEADER_Kid.png" alt="About Header Image" />
    				<p>About</p>
    			</div>
    			<div class="section-content">
    				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare porta fringilla. Cum sociis natoque penatibuset magnis dis parturient montes, nascetur ridiculus mus. Etiam suscipit adipiscing neque, a sodales risus vehicula at. Sed justo sapien, commodo sed viverra id, pharetra vitae elit. Nulla quis nulla a tortor dignissim pellentesque. Donec volutpat eros at erat facilisis vitae varius ante
    				</p>
    			</div>
    		</div>
    		<div class="section prizes">
    			<div class="section-header">
    				<img src="/images/prizes/HEADER_Prizes.png" alt="Prizes Header Image" />
    				<p>Prizes</p>
    			</div>
    			<div class="prize-grid">
    					<div class="prize-grid-container">
    						<ul>
    							<li class="unset">loading...</li>
    							<li class="unset">loading...</li>
    							<li class="unset">loading...</li>
    							<li class="unset">loading...</li>
    							<li class="unset">loading...</li>
    							<li class="unset">loading...</li>
    							<li class="unset">loading...</li>
    							<li class="unset">loading...</li>
    							<li class="unset">loading...</li>
    						</ul>
    					</div>
    				</div>
    		</div>
    		<div class="section instructions">
    			<div class="section-header">
    				<img src="/images/instructions/HEADER_Gamepad.png" alt="Instructions Header Image" />
    				<p>Instructions</p>
    			</div>
    			<div class="target-grid">
    				<p>Press right or left to change your aim</p>
    				<img src="/images/instructions/arrow_keys.png" alt="Arrows Instruction Image" class="instructions-img" />
    				<p>and when you're ready</p>
    				<img src="/images/instructions/spacebar300.png" alt="Spacebar Instruction Image" class="instructions-img" />
    				<p>Press the space bar to fire</p>
    				<p>Each target is worth the following:</p>
    				<div class="target-grid-container">
    					<ul>
    						<li>
    							<img src="/images/instructions/Targets/kid.png" />
    							<p>25 points</p>
    						</li>
    						<li>
    							<img src="/images/instructions/Targets/snowman.png" />
    							<p>50 points</p>
    						</li>
    						<li>
    							<img src="/images/instructions/Targets/rudolf.png" />
    							<p>75 points</p>
    						</li>
    						<li>
    							<img src="/images/instructions/Targets/santa.png" />
    							<p>100 points</p>
    						</li>
    						<li>
    							<img src="/images/instructions/Targets/nutcracker.png" />
    							<p>125 points</p>
    						</li>
    						<li>
    							<img src="/images/instructions/Targets/polar.png" />
    							<p>150 points</p>
    						</li>
    					</ul>
    				</div>
    			</div>
    		</div>
    		<div class="section leaderboard">
    			<div class="section-header">
    				<img src="/images/leaderboard/HEADER_Star.png" alt="LeaderBoard Header Image" />
    				<p>LeaderBoard</p>
    			</div>
    			<div class="section-slider">
    				<div class="slider-container">
    					<div class="score-cards">
    						<div class="card card_fluid_fix card-one">
    							<div class="card-inner">
    								<p class="title">Day 1</p>
    								<div class="score-item"><ul><li class="present"><img src="/images/prizes/present1.png" /></li><li class="user-details">.../...</li><li class="user-score">000000</li></ul></div>
    								<div class="score-item"><ul><li class="present"><img src="/images/prizes/present2.png" /></li><li class="user-details">.../...</li><li class="user-score">000000</li></ul></div>
    								<div class="score-item"><ul><li class="present"><img src="/images/prizes/present3.png" /></li><li class="user-details">.../...</li><li class="user-score">000000</li></ul></div>
    								<div class="score-item"><ul><li class="present"></li><li class="user-details">.../...</li><li class="user-score">000000</li></ul></div>
    								<div class="score-item"><ul><li class="present"></li><li class="user-details">.../...</li><li class="user-score">000000</li></ul></div>
    								<div class="score-item"><ul><li class="present"></li><li class="user-details">.../...</li><li class="user-score">000000</li></ul></div>
    								<div class="score-item"><ul><li class="present"></li><li class="user-details">.../...</li><li class="user-score">000000</li></ul></div>
    								<div class="score-item"><ul><li class="present"></li><li class="user-details">.../...</li><li class="user-score">000000</li></ul></div>
    								<div class="score-item"><ul><li class="present"></li><li class="user-details">.../...</li><li class="user-score">000000</li></ul></div>
    								<div class="score-item"><ul><li class="present"></li><li class="user-details">.../...</li><li class="user-score">000000</li></ul></div>
    							</div>
    						</div>
    						<div class="card card-two">
    							<div class="card-inner">
    								<p class="title">Day 2</p>
    								<div class="score-item"><ul><li class="present"><img src="/images/prizes/present1.png" /></li><li class="user-details">.../...</li><li class="user-score">000000</li></ul></div>
    								<div class="score-item"><ul><li class="present"><img src="/images/prizes/present2.png" /></li><li class="user-details">.../...</li><li class="user-score">000000</li></ul></div>
    								<div class="score-item"><ul><li class="present"><img src="/images/prizes/present3.png" /></li><li class="user-details">.../...</li><li class="user-score">000000</li></ul></div>
    								<div class="score-item"><ul><li class="present"></li><li class="user-details">.../...</li><li class="user-score">000000</li></ul></div>
    								<div class="score-item"><ul><li class="present"></li><li class="user-details">.../...</li><li class="user-score">000000</li></ul></div>
    								<div class="score-item"><ul><li class="present"></li><li class="user-details">.../...</li><li class="user-score">000000</li></ul></div>
    								<div class="score-item"><ul><li class="present"></li><li class="user-details">.../...</li><li class="user-score">000000</li></ul></div>
    								<div class="score-item"><ul><li class="present"></li><li class="user-details">.../...</li><li class="user-score">000000</li></ul></div>
    								<div class="score-item"><ul><li class="present"></li><li class="user-details">.../...</li><li class="user-score">000000</li></ul></div>
    								<div class="score-item"><ul><li class="present"></li><li class="user-details">.../...</li><li class="user-score">000000</li></ul></div>
    							</div>
    						</div>
    						<div class="card card-three">
    							<div class="card-inner">
    								<p class="title">Day 3</p>
    								<div class="score-item"><ul><li class="present"><img src="/images/prizes/present1.png" /></li><li class="user-details">.../...</li><li class="user-score">000000</li></ul></div>
    								<div class="score-item"><ul><li class="present"><img src="/images/prizes/present2.png" /></li><li class="user-details">.../...</li><li class="user-score">000000</li></ul></div>
    								<div class="score-item"><ul><li class="present"><img src="/images/prizes/present3.png" /></li><li class="user-details">.../...</li><li class="user-score">000000</li></ul></div>
    								<div class="score-item"><ul><li class="present"></li><li class="user-details">.../...</li><li class="user-score">000000</li></ul></div>
    								<div class="score-item"><ul><li class="present"></li><li class="user-details">.../...</li><li class="user-score">000000</li></ul></div>
    								<div class="score-item"><ul><li class="present"></li><li class="user-details">.../...</li><li class="user-score">000000</li></ul></div>
    								<div class="score-item"><ul><li class="present"></li><li class="user-details">.../...</li><li class="user-score">000000</li></ul></div>
    								<div class="score-item"><ul><li class="present"></li><li class="user-details">.../...</li><li class="user-score">000000</li></ul></div>
    								<div class="score-item"><ul><li class="present"></li><li class="user-details">.../...</li><li class="user-score">000000</li></ul></div>
    								<div class="score-item"><ul><li class="present"></li><li class="user-details">.../...</li><li class="user-score">000000</li></ul></div>
    							</div>
    						</div>
    					</div>
    				</div>
    				<div class="slider-navigation">
    					<div class="slider-navigation-inner">
    						<ul>
    						</ul>
    					</div>
    				</div>
    			</div>
    		</div>
    		<div class="footer-container">
    			<div class="back-top">
    				<img src="/images/general/backtotop.png" alt="Back To Top" />
    				<p>Back to top</p>
    			</div>
    			<img src="/images/general/footer.png" alt="Christmas Card Characters Footer Image" class="footer-img" />
    		</div>
    	</div>	
    </body>
</html>