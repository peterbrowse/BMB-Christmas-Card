<!DOCTYPE html>
<html>
	<head>
        <title>BMB Christmas Card 2012/13</title>
        <meta charset="UTF-8">
         
    	<script type="text/javascript" src="http://code.jquery.com/jquery-latest.min.js"></script>
    	<script type="text/javascript" src="http://code.jquery.com/ui/1.9.2/jquery-ui.js"></script>
		<script type="text/javascript" src="http://ajax.microsoft.com/ajax/jquery.templates/beta1/jquery.tmpl.min.js"></script>
		<script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.0.rc.1/handlebars.min.js"></script>
		<script type="text/javascript" src="http://5.79.16.234:8080/socket.io/socket.io.js"></script>
		<script type="text/javascript" src="js/jquerymx-3.2.custom.min.js"></script>
		<script type="text/javascript" src="js/jquery.jplayer.min.js"></script>
		
		<script type="text/javascript" src="js/function.js?v=<?php echo filemtime('js/function.js')?>"></script>
		<script type="text/javascript" src="js/jquery.cycle.all.js?v=<?php echo filemtime('js/jquery.cycle.all.js')?>"></script>
		<script type="text/javascript" src="js/socket_io_client_tester.js?v=<?php echo filemtime('js/socket_io_client.js')?>"></script>
		<script type="text/javascript" src="js/nested_functions/timer.js?v=<?php echo filemtime('js/nested_functions/timer.js')?>"></script>

        <link rel="stylesheet" href="css/MyFontsWebfontsKit.css" type="text/css" />
		<link rel="stylesheet" href="css/base-reset.css?v=<?php echo filemtime('css/base-reset.css')?>" type="text/css" />
        <link rel="stylesheet" href="css/general.css?v=<?php echo filemtime('css/general.css')?>" type="text/css" />
        <link rel="stylesheet" href="css/typography.css?v=<?php echo filemtime('css/typography.css')?>" type="text/css" />
        <link rel="stylesheet" href="css/states.css?v=<?php echo filemtime('css/states.css')?>" type="text/css" />
        
        <script type="text/javascript" src="js/respond.src.js?v=<?php echo filemtime('js/respond.src.js')?>"></script>
	</head>
    <body>
    	<div class="container">
    		<div class="server_contact-container">
    			<h1>Contacting Santa...</h1>
    		</div>
    		<div class="cheat">
    			<h1>Naughty, you've just found your way on to Santa's black list.</h1>
    		</div>
    		<div class="entry-form-container">
    			<h1>Welcome</h1>
    			<form class="entry-form">
            		<label id="user-email-label" for="user-email">Choose a username</label><br />
            		<input id="user-email" />
            		<div class="submit-button">Enter</div>
            		<div id="user-error">HO HO OH No, I'm sorry, you aren't on the good list.</div>
        		</form>
    		</div>
    		<div class="servo-container">
    			<!--<iframe width="560" height="340" src="http://cdn.livestream.com/embed/bmbchristmas?layout=4&amp;height=340&amp;width=560&amp;autoplay=true" style="border:0;outline:0" frameborder="0" scrolling="no"></iframe>-->
    			<div class="status-bar"></div>
    			<div class="servo">
    				<div class="servo-screw TL">+</div>
    				<div class="servo-screw TR">+</div>
    				<div class="servo-screw BL">+</div>
    				<div class="servo-screw BR">+</div>
    				<div class="servo-body">
    					<div class="servo-head">
    						<div class="servo-screw servo-head-fix">+</div>
    					</div>
    					<div class="servo-label"></div>
    				</div>
    			</div>
    			
    			<div class="queue-buttons">
    				<div class="queue-button join">Join Queue</div>
    				<div class="queue-button leave queue-button-off">Leave Queue</div>
    			</div>
    			<div class="question-lobby-game">
    				On the next screen you will be presented with fire control commands.<br />
    				If you understand this, click start now, else you'll be automatically switched when the time runs out.<br />
    				Time Remaining: <span id="countdown">10</span>
    				<div class="startButton">Start Now</div>
    			</div>
    			<div class="movement-buttons">
    				<div class="movebutton" rel="left">Left</div>
    				<div class="movebutton" rel="reset">Reset</div>
    				<div class="movebutton" rel="fire">FIRE</div>
    				<div class="movebutton" rel="right">Right</div>
    			</div>
    		</div>
    		<div class="presenter-container">
    			<ul class="present-list">
    				<li class="present-item unset"></li>
    				<li class="present-item unset"></li>
    				<li class="present-item unset"></li>
    				<li class="present-item unset"></li>
    				<li class="present-item unset"></li>
    				<li class="present-item unset"></li>
    				<li class="present-item unset"></li>
    				<li class="present-item unset"></li>
    				<li class="present-item unset"></li>
    			</ul>
    		</div>
    	</div>
    </body>
</html>