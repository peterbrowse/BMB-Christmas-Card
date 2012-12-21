$.fn.simpleCountDownStart = function(settings,whereat) {
	settings = jQuery.extend({
		interval: 1000,
		startFrom: 10,
		endAt: 0,
		callBack: function() { }
	}, settings);
	return this.each(function() {
		if(whereat == null && whereat != settings.endAt) {
			whereat = settings.startFrom;
		}
		jQuery(this).text(whereat.countDownMinutes());
		if(whereat > settings.endAt) {
			whereat = whereat-1;
			var eleCont = jQuery(this);
			$.fn.simpleCountDownStart.timer = setTimeout(function(){ eleCont.simpleCountDownStart(settings, whereat);},settings.interval);
		}
		else {
			settings.callBack(this);
		}
	});
};

$.fn.simpleCountDownStop = function() {
	clearTimeout($.fn.simpleCountDownStart.timer);
};

$.fn.userReadyCountDownStart = function(settings,whereat) {
	settings = jQuery.extend({
		interval: 1000,
		startFrom: 10,
		endAt: 0,
		callBack: function() { }
	}, settings);
	return this.each(function() {
		if(whereat == null && whereat != settings.endAt) {
			whereat = settings.startFrom;
		}
		var currentPercent = (whereat / settings.startFrom) * 100;
		if(currentPercent < 83.333335 && currentPercent > 66.666668) {
			$('img.hex-counter-1').remove();
		}
		
		else if(currentPercent < 66.666668 && currentPercent > 50.000001) {
			$('img.hex-counter-2').remove();
		}
		
		else if(currentPercent < 50.000001 && currentPercent > 33.333334) {
			$('img.hex-counter-3').remove();
		}
		
		else if(currentPercent < 33.333334 && currentPercent > 16.666667) {
			$('img.hex-counter-4').remove(); 
		}
		
		else if(currentPercent < 16.666667 && currentPercent > 1) {
			$('img.hex-counter-5').remove();
		}
		
		$(this).text(whereat.countDownMinutes());
		if(whereat > settings.endAt) {
			whereat = whereat-1;
			var eleCont = jQuery(this);
			$.fn.userReadyCountDownStart.timer = setTimeout(function(){ eleCont.userReadyCountDownStart(settings, whereat);},settings.interval);
		}
		else {
			$('img.hex-counter-6').hide();
			var counterdelay = setTimeout(function(){ clearTimeout(counterdelay); settings.callBack(this);}, 1000);
		}
	});
};

$.fn.userReadyCountDownStop = function() {
	clearTimeout($.fn.userReadyCountDownStart.timer);
};

Number.prototype.countDownMinutes = function() {
	var minutes = Math.floor(this / 60);
	var seconds = this - minutes * 60;
	
	return minutes.zeroPad(2) + ":" + seconds.zeroPad(2);
};