function loading_screen(message) {
	var loadingSource = $(".connecting-template").html();
	var loadingTemplate = Handlebars.compile(loadingSource);
	var data = {
		className: message,
		message: message,
		bgColour: "red"
	}
	$(".scene-container").html(loadingTemplate(data)); 
};

function doorman_screen(className,message,bgColour, top_3_presents, top_3_scores, currentDay) {
	var doormanSource = $('.doorman-template').html();
	var doormanTemplate = Handlebars.compile(doormanSource);
	
	if(className == 'closed') {
		var content = '<img src="/images/interface/closed_banner.png" alt="Closed Banner Image" /><p>'+ message + '</p>';
	}
	else if(className == 'pre-open') {
		var content = '<div class="doorman-logo-closed"><p>Three days of sprouty goodness...</p><p>'+ message + ' 2012!</p></div>';
	}
	
	else if(className == 'before-opening-hours'){
		var content = '<div class="doorman-logo-closed"><p>Three days of sprouty goodness...</p><p>'+ message + '</p></div>';
	}
	
	else if(className == 'after-opening-hours') {
		var content = "<div class='white-drop'><img src='/images/interface/corner_left_top_white.png' /><p>Today's winners</p><img src='/images/interface/corner_right_top_white.png' /></div><div class='clearfix'></div><div class='today-over-container'><p>Today's game is over. Here are the winners!</p></div><div class='winners-holder'><ul>"
		
		switch (currentDay)
		{
			case 1:
  				day = 'score_day_1';
  				break;
			case 2:
 				day = 'score_day_2';
  				break;
			case 3:
 				day = 'score_day_3';
  				break;
		}
		
		for (var i = 1; i < 4; i++) {
			content = content + "<li><img src='/images/prizes/present"+ i +".png' /><p class='prize-name'>" + top_3_presents[i-1]['present_name'] + "</p><p class='player-score'>" + top_3_scores[i-1][day].zeroPad(6) +"</p><p class='player-title'>" + top_3_scores[i-1]['first_name'].maxCharacters(12) + "/" + top_3_scores[i-1]['client'].maxCharacters(12) + "</p><p class='player-position'>" + i.getOrdinal(); + "</p></li>";
		}
		
		content = content + "</ul></div><div class='come-back'><p>" + message + "</p></div>";
		
		
	}
	
	var data = {
		className: className,
		message: message,
		bgColour: bgColour,
		content: content
	}
	$('.scene-container').html(doormanTemplate(data));
};

function login_screen(className, bgColour, message) {
	var loginSource = $(".login-template").html();
	var loginTemplate = Handlebars.compile(loginSource);
	
	if (className == 'intro') {
		var content = "<div class='login-form-holder'></div>";
	}
	
	else if (className == 'form') {
		var content = '<div class="login-form-form"><form class="user-form"><input class="user-email" /><div class="user-form-submit-text"><p>Log in with your email address to play the game!</p></div><div class="user-form-submit-button"><p>Go</p></div><input type="submit" /></form></div>';
	}
	
	else if (className == 'wrong') {
		var content = '<div class="login-form-wrong"><form class="user-form-wrong"><input class="user-email-wrong" /><div class="user-form-submit-text-wrong"><p>' + message + '</p></div><div class="user-form-submit-button-wrong"><p>Try Again</p></div><input type="submit" /></form></div>';
	}
	
	var data = {
		className: className,
		bgColour: bgColour,
		content: content
	}
	
   	$('.scene-container').html(loginTemplate(data));
}

function lobby_screen() {
	var lobbySource = $('.lobby-template').html();
	var lobbyTemplate = Handlebars.compile(lobbySource);
	
	$('.scene-container').html(lobbyTemplate());
	
	$('.global-help-button').bind('click',function(){
		$('.global-help').show();
	});
	
	$('.global-close-button').bind('click',function(){
		$('.global-help').hide();
	});
};

function userReady_screen() {
	var userReadySource = $('.userReady-template').html();
	var userReadyTemplate = Handlebars.compile(userReadySource);
	
	$('.scene-container').html(userReadyTemplate());
		$('.global-help-button').bind('click',function(){
		$('.global-help').show();
	});
	
	$('.global-close-button').bind('click',function(){
		$('.global-help').hide();
	});
	
	targetScroller();//to animate the targets points scroller
};

function audio_player() {
	var audioSource = $('.audio-template').html();
	var audioTemplate = Handlebars.compile(audioSource);
	
	$('.scene-outter').prepend(audioTemplate()).find('.music-container').bind('click', function() {
		$(".music-container p").toggleClass('off');
		
		if($(".music-container p").hasClass('off') == false) {
			$(".music-file").jPlayer("play",0);
			$('.fire-file').jPlayer('muted',1);
			$('.score-file').jPlayer('muted',1);
			//USER READY BELL SOUND ADD HERE
		}
		
		else {
			$(".music-file").jPlayer("pause",0);
			$('.fire-file').jPlayer('muted',0);
			$('.score-file').jPlayer('muted',0);
			//USER READY BELL SOUND ADD HERE
		}
  	});
};
//start scroll fn

/* scroll the "target" images and points values on the "get ready" page */
function targetScroller(){
	var scroller = $('.target-scroller');
	var scrollerContent = scroller.children('ul');
	scrollerContent.children().clone().appendTo(scrollerContent);
	var curX = 0;
	scrollerContent.children().each(function(){
		var $this = $(this);
		$this.css('left', curX);
		curX += $this.width();
	});
	var fullW = curX / 2;
	var viewportW = scroller.width();

	// Scrolling speed management
	var controller = {curSpeed:0, fullSpeed:2};
	var $controller = $(controller);
	var tweenToNewSpeed = function(newSpeed, duration)
	{
		if (duration === undefined){
			duration = 300;
			}
		$controller.stop(true).animate({curSpeed:newSpeed}, duration, "linear");
	};

	// Pause on hover
	/*scroller.hover(function(){
		tweenToNewSpeed(0);
	}, function(){
		tweenToNewSpeed(controller.fullSpeed);
	});*/

	// Scrolling management; start the automatic scrolling
	var doScroll = function()
	{
		var curX = scroller.scrollLeft();
		var newX = curX + controller.curSpeed;
		if (newX > fullW*2 - viewportW){
			newX -= fullW;
			}
		scroller.scrollLeft(newX);
	};
	setInterval(doScroll, 26);//the speed of scroll
	tweenToNewSpeed(controller.fullSpeed);
};	



Handlebars.registerHelper('randColour', function(word) {
	var color = ['#009444','#006838','#2bb673'];
	var newWord = '';
	word =  word.charAt(0).toUpperCase() + word.slice(1);
	
	for (var i = 0, len = word.length; i < len; i++) {
		var rdn = Math.floor((Math.random()*3));
  		newWord += ('<span style="color:' + color[rdn] + ';">' + word.charAt(i) + '</span>');
	}

  	return newWord;
});

Handlebars.registerHelper("debug", function(optionalValue) {
	console.log("Current Context");
	console.log("====================");
	console.log(this);   
	if (optionalValue) {
		console.log("Value"); 
		console.log("====================");
		console.log(optionalValue); 
	} 
});




var swfVersionStr = "10.2.0";
            // To use express install, set to playerProductInstall.swf, otherwise the empty string. 
var xiSwfUrlStr = "playerProductInstall.swf";
var flashvars = {};
var params = {};
params.quality = "high";
params.bgcolor = "#ffffff";
params.allowscriptaccess = "sameDomain";
params.allowfullscreen = "true";
var attributes = {};
attributes.id = "Main";
attributes.name = "Main";
attributes.align = "middle";
swfobject.embedSWF(
	"Main.swf", "flashContent", 
    "780", "439", 
swfVersionStr, xiSwfUrlStr, 
flashvars, params, attributes);
// JavaScript enabled so display the flashContent div in case it is not replaced with a swf object.
swfobject.createCSS("#flashContent", "display:block;text-align:left;");