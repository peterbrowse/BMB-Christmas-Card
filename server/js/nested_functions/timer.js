$.fn.simpleCountDown = function(settings,whereat) {
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
jQuery(this).text(whereat);
if(whereat > settings.endAt) {
whereat = whereat-1;
var eleCont = jQuery(this);
setTimeout(function(){ eleCont.simpleCountDown(settings, whereat);},settings.interval);
}
else {
jQuery(this).text("Done");
settings.callBack(this);
}
});
};