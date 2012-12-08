$('document').ready(function() {
	/* PRODUCTION SCOPE */
	
	setTimeout(function() { 
		if(navigator.userAgent.match(/iPhone/i)) { 
				if(window.pageYOffset == 0) { 
					window.scrollTo(0, 1); 
				}
			}
		}, 100
	);
	
	$('.menu-container li').click(function() {
		
		var $item = $('.' + $(this).text().toLowerCase());
		var $menuHeight = $('.menu-container').height() - 1;
		
		var $itemOffset = $item.offset();
		var $itemParent = $item.parent();
		var $itemOffsetTop = $itemOffset.top;
		
		$('html,body').animate({scrollTop: $itemOffsetTop - $menuHeight}, 800);
	});
	
	$('.back-top').click(function() {
		$('html,body').animate({scrollTop: 0}, {duration: 800});
	});
	
	
	
	$('.score-cards').cycle({
		slideExpr: '.card',
		fx: 'scrollLeft',
		timeout: 3500,
		speed: 800,
		easing: 'linear',
		slideResize: 0,
        containerResize: 0,
        fit: 1,
        pager: '.slider-navigation-inner ul',
        pagerAnchorBuilder: function(idx, slide) {
        	return '<li><div class="slider-navigation-point"></div></li>';
        },
        pauseOnPagerHover: 1
	});
	
	/* END PRODUCTION SCROPE */


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

$(window).scroll(function () {
	navigation();
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

function navigation() {
	var $menuOffset = $('.about').offset().top - $('.menu-container').height();

	if($(document).scrollTop() >= $menuOffset) {
		$('.menu-container').css('position','fixed');
		$('.menu-container').css('top',0);
		$('.header-container').css('padding-bottom',$('.menu-container').height());
		
		$('.back-top').slideDown(200);
	}
	
	else {
		$('.menu-container').css('position','relative');
		$('.menu-container').css('top',0);
		$('.header-container').css('padding-bottom',0);
		$('.back-top').slideUp(200);
	}
};

Number.prototype.zeroPad = function(places) {
	var num = this;
	var zero = places - num.toString().length + 1;
  	return Array(+(zero > 0 && zero)).join("0") + num;
};

Date.prototype.zeroPad = function(places) {
	var num = this;
	var zero = places - num.toString().length + 1;
  	return Array(+(zero > 0 && zero)).join("0") + num;
};

Date.prototype.monthNames = [
    "January", "February", "March",
    "April", "May", "June",
    "July", "August", "September",
    "October", "November", "December"
];

Date.prototype.dayNames = [
	"Monday", "Tuesday", "Wednesday",
	"Thursday", "Friday", "Saturday",
	"Sunday"
];

Number.prototype.getOrdinal = function()
{
var n = this % 100;
var suff = ["th", "st", "nd", "rd", "th"]; // suff for suffix
var ord= n<21?(n<4 ? suff[n]:suff[0]): (n%10>4 ? suff[0] : suff[n%10]);
return this + ord;
}

Date.prototype.getMonthName = function() {
    return this.monthNames[this.getMonth()];
};
Date.prototype.getShortMonthName = function () {
    return this.getMonthName().substr(0, 3);
};

Date.prototype.getDayName = function() {
	return this.dayNames[this.getDay()];
}

Array.prototype.remove = function(element) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == element) { this.splice(i,1); }
  }
};

function dropSprout(target) {
	$('.'+target).append('<div class="falling_sprout"><img src="/images/interface/sprout.png" /></div>');
	
	$('.falling_sprout').animate({ 
    	top: "+=155px"
    }, 500, function(){
      	$(this).remove();
    });
};

String.prototype.maxCharacters = function(limit){
	if(this.length >= limit) {
    	return this.substring(0,limit) + "<span class='maxCharacters'>...</span>";
    }
    
    else {
    	return this;
    }
};

//STREAM READY HANDLER
function streamReady() {
	$('object#Main').fadeIn(500);
}
		
//STREAM ERROR HANDLER
function streamError(error) {
	alert("Don't look at me, it's not my streaming platform. Here is the error: "+error);
}