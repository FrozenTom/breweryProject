var brw = [];
var numBeers=1;
var idString = `<div class="form-group row" id="` + numBeers + `">`
var startString = 
	`
			<label for="example-text-input" class="col-2 col-form-label">Beer:</label>
				<div class="form-group">
					<select class="form-control beer" id="beerSelect">
	`;
var endString = `
				    </select>
				</div>
		</div>
`;
function makeGraph(){
	var ctx = document.getElementById("myChart");
	var myChart;
	$("#submit").click(function (){
		var names = [];
		var data = [];
		var brwLoc = brw.map(function(x) {return x.name}).indexOf($("#brewerySelect option:selected" ).text());
		$( ".beer option:selected" ).each(function( index ) {
			var beerLoc = brw[brwLoc].beers.map(function(x) {return x.name}).indexOf($(this).text());
			names.push($(this).text())
			data.push(brw[brwLoc].beers[beerLoc].rating)
			
			console.log( index + ": " + $( this ).text() );
		});
		if(myChart){
			myChart.destroy();
			ctx = document.getElementById("myChart");
		}
		myChart = new Chart(ctx, {
		    type: 'bar',
		    data: {
		        labels: names,
		        datasets: [{
		            label: 'Average Rating',
		            data: data,
		            borderWidth: 1
		        }]
		    },
		    options: {
		        scales: {
		            yAxes: [{
		                ticks: {
		                    beginAtZero:true
		                }
		            }]
		        }
		    }
		});
	});
}

function setBreweryMenu(){

	$("#brewerySelect").empty();
	for(var i = 0; i < brw.length; i++){
		$("#brewerySelect").append("<option>"+brw[i].name+"</option>")
		
	}
	var loc = 0
	var brewery = brw[loc];
	//console.log(brewery)
	$(".beer").empty();
	$(".beer").append(brewery.beerOptions);
	
}
function fillBeerMenu(){
	//console.log("here");
	$("#brewerySelect" ).change(function() {
			//console.log("here2");
			var loc = brw.map(function(x) {return x.name}).indexOf($("#brewerySelect option:selected" ).text());
	    	var brewery = brw[loc];
	    	$(".beer").empty();
	    	$(".beer").append(brewery.beerOptions);
	});
}

function addButton(){
	
	$("#addBeer").click(function (){
		//console.log($("#brewerySelect option:selected" ).text());
		var loc = brw.map(function(x) {return x.name}).indexOf($("#brewerySelect option:selected" ).text());
		var brewery = brw[loc];
		var middleString = brewery.beerOptions;
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






function breweryList(breweryName,callback){
	var breweries = [];
	$.getJSON("/untappedBreweryProject/sampleJsonFiles/brewerySearch.json", function(data) {
		
		for(var i = 0; i < data.response.brewery.items.length; i++){
			breweries[i] = [data.response.brewery.items[i].brewery.brewery_name, data.response.brewery.items[i].brewery.brewery_id];
		}
		callback(breweries);
	});
};

function readBeerList(breweryID,callback){
	var beers = [];
	$.getJSON("/untappedBreweryProject/sampleJsonFiles/enegren.json", function(data) {
		for(var i = 0; i < data.response.brewery.beer_list.items.length; i++){
		  	beers[i] = new beer(data.response.brewery.beer_list.items[i].beer.beer_name, 
		  			data.response.brewery.beer_list.items[i].beer.bid,
		  			data.response.brewery.beer_list.items[i].beer.rating_score);
		};
		//console.log(JSON.stringify(beers))
		callback(beers)
	});
};

$(document).ready(function(){
	function breweryCallback(breweries) {
		//makeGraph(breweries[0].beerNames,breweries[0].beerRatings);
		function beerCallback(beers) {
			brw = [new brewery(breweries[0][0],breweries[0][1],beers)];
			setBreweryMenu();
			//makeGraph(brw[0].beerNames,brw[0].beerRatings);
			//console.log(JSON.stringify(brw));
		}
		readBeerList(breweries[0][1], beerCallback)
	}
	breweryList("enegren",breweryCallback);
	addButton();
	fillBeerMenu();
	makeGraph();
});
