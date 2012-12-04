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