function loading_screen(message) {
	var source   = $(".connecting-template").html();
	var template = Handlebars.compile(source);
	var data = {
		className: message,
		message: message,
		bgColour: "red"
	}
	$(".scene-container").html(template(data));
};

Handlebars.registerHelper('randColour', function(word) {
	var color = ['#009444','#006838','#2bb673'];
	var newWord = '';
	
	for (var i = 0, len = word.length; i < len; i++) {
		var rdn = Math.floor((Math.random()*3));
  		newWord = newWord + '<span style="color:' + color[rdn] + ';">' + word[i] + '</span>';
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