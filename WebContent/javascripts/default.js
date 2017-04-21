

var addButton = function(){
	
	$("#addBeer").click(function (){
		numBeers++;
		idString = `<div class="form-group row" id="` + numBeers + `">`;
		$("#beerRows").append(idString + startString + middleString + endString);
		
		
	});
	$("#removeBeer").click(function (){
		if(numBeers > 1 ){
			$("#"+numBeers).remove();
			numBeers--;
		}
	});
};