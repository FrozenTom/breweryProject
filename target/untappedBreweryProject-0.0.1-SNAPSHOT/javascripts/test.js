/**
 * 
 */
calls = 5;
callsR = 100;

window.onload = function(){
	y = Math.floor((Math.random() * 100) + 1);
	document.getElementById("api").innerHTML = calls +" of " + callsR + " calls remain" ;
};


