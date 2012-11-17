$('document').ready(function() {
	$('.queue-button').mousedown(function(){
		$(this).css('box-shadow','inset 0px 0px 2px 2px #ccc');
		$(this).css('font-size','9px');
	});
	
	$('.queue-button').mouseup(function(){
		$(this).css('box-shadow','0px 0px 2px 2px #ccc');
		$(this).css('font-size','10px');
		
		$('.queue-button').toggleClass("queue-button-off");
	});
});


function resetServo() {
	$('.servo-head').animate({  borderSpacing: 90 }, {
    	step: function(now,fx) {
      		$(this).css('-webkit-transform','rotate('+now+'deg)');
      		$(this).css('-moz-transform','rotate('+now+'deg)'); 
      		$(this).css('transform','rotate('+now+'deg)');  
    	},
    	duration:'slow'
	},'linear');
};
			
function servoRight() {
	$('.servo-head').animate({  borderSpacing: +180 }, {
    	step: function(now,fx) {
      		$(this).css('-webkit-transform','rotate('+now+'deg)');
      		$(this).css('-moz-transform','rotate('+now+'deg)'); 
      		$(this).css('transform','rotate('+now+'deg)');  
    	},
    	duration:'slow'
	},'linear');
};
			
function servoLeft() {
	$('.servo-head').animate({  borderSpacing: 0 }, {
    	step: function(now,fx) {
      		$(this).css('-webkit-transform','rotate('+now+'deg)');
      		$(this).css('-moz-transform','rotate('+now+'deg)'); 
      		$(this).css('transform','rotate('+now+'deg)');  
    	},
    	duration:'slow'
	},'linear');
};
			
function servoRange() {
	$('.servo-head').animate({  borderSpacing: +180 }, {
    	step: function(now,fx) {
      		$(this).css('-webkit-transform','rotate('+now+'deg)');
      		$(this).css('-moz-transform','rotate('+now+'deg)'); 
      		$(this).css('transform','rotate('+now+'deg)');  
    	},
    	duration:'slow'
	},'linear');
				
	$('.servo-head').animate({  borderSpacing: 0 }, {
    	step: function(now,fx) {
      		$(this).css('-webkit-transform','rotate('+now+'deg)');
      		$(this).css('-moz-transform','rotate('+now+'deg)'); 
      		$(this).css('transform','rotate('+now+'deg)');  
    	},
    	duration:'slow'
	},'linear');
				
	$('.servo-head').animate({  borderSpacing: 90 }, {
    	step: function(now,fx) {
      		$(this).css('-webkit-transform','rotate('+now+'deg)');
      		$(this).css('-moz-transform','rotate('+now+'deg)'); 
      		$(this).css('transform','rotate('+now+'deg)');  
    	},
    	duration:'slow'
	},'linear');
};