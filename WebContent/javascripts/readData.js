var breweries = [];
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
	var ctx1 = document.getElementById("chart1");
	var ctx2 = document.getElementById("chart2");
	var ctx3 = document.getElementById("chart3");
	var ctx4 = document.getElementById("chart4");
	var chart1;
	var chart2;
	var chart3;
	var chart4;
	var beerLocs = [];
	var count = 0;
	var drp = $('#reportrange').data('daterangepicker');
	var maxCount = 0;
	var brwLoc
	$("#submit").click(function (){
		
		brwLoc = breweries.map(function(x) {return x.name}).indexOf($("#brewerySelect option:selected" ).text());
		maxCount = $( ".beer option:selected" ).length;
		console.log("maxCount:" + maxCount);
		
		$( ".beer option:selected" ).each(function( index ) {
			var beerLoc = breweries[brwLoc].beers.map(function(x) {return x.name}).indexOf($(this).text());
			beerLocs.push(beerLoc);
			pullDataFromJson(breweries[brwLoc].beers[beerLoc])
			
		});
		
		
	});
		
	function pullDataFromJson(beer, startID = 0) {
		beer.emptyCheckin();
		var done = false;
		var connectionString = "https://api.untappd.com/v4/beer/checkins/"+beer.id+"?access_token=58BFAE75D0393B7ED61DAF2C806CC7F89F755870";
		if(startID != 0) {
			connectionString = "https://api.untappd.com/v4/beer/checkins/"+beer.id+"?max_id="+startID+"&access_token=58BFAE75D0393B7ED61DAF2C806CC7F89F755870"
		} 
		var newStartID = 0;
		$.getJSON(connectionString, function(json) {
			for(var i = 0; i < json.response.checkins.items.length; i++){
				if(new Date(json.response.checkins.items[i].created_at).getTime() >= new Date(drp.startDate).getTime()) {
					if(new Date(json.response.checkins.items[i].created_at).getTime() <= new Date(drp.endDate).getTime()) {
						var check = new checkin(
								json.response.checkins.items[i].checkin_id,
								json.response.checkins.items[i].user.uid,
								//json.response.checkins.items[i].venue.venue_id,
								//json.response.checkins.items[i].venue.location.lat,
								//json.response.checkins.items[i].venue.location.lng,
								json.response.checkins.items[i].comments.total_count,
								json.response.checkins.items[i].comments.toasts,
								json.response.checkins.items[i].rating_score,
								json.response.checkins.items[i].created_at
						);
						beer.addCheckin(check);
						newStartID = json.response.checkins.items[i].checkin_id;
					}
					
					else { //when check in happened after date
						
					}
				} else { //when check in happened before date
					done = true;
				}
			}
			 if(json.response.checkins.items.length<25) {
				 done = true;
			 }
			
			
			
			if(done) {
				console.log(" one beer data collection finished");
				console.log("Count:" + count);
				count++;
			} else {
				pullDataFromJson(beer, startID = newStartID);
				console.log("more beer data collection called");
			}
			if(count == maxCount) {
				console.log("all beer data collection finished");
				createGraphs();
				count = 0;
			}
		});
		
			
	}
		
	function createGraphs() {
		console.log("create graph called");
		var names = [];
		var dataBar = [];
		var dataPie = [];
		
		for(var i = 0 ; i < beerLocs.length;i++) {
			dataPie.push(breweries[brwLoc].beers[beerLocs[i]].activity.length);
			dataBar.push(breweries[brwLoc].beers[beerLocs[i]].getRatingFromActivity());
			names.push(breweries[brwLoc].beers[beerLocs[i]].name);
			
		}
		beerLocs = [];
		if(chart1){
			chart1.destroy();
			ctx1 = document.getElementById("chart1");
		}
		if(chart2){
			chart2.destroy();
			ctx2 = document.getElementById("chart2");
		}
		if(chart3){
			chart3.destroy();
			ctx3 = document.getElementById("chart3");
		}
		if(chart4){
			chart4.destroy();
			ctx4 = document.getElementById("chart4");
		}
		chart1 = new Chart(ctx1, {
		    type: 'bar',
		    data: {
		        labels: names,
		        datasets: [{
		            label: 'Average Rating',
		            data: dataBar,
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
		chart2 = new Chart(ctx2, {
		    type: 'pie',
		    data: {
		        labels: names,
		        datasets: [{
		            label: 'Num Check Ins',
		            data: dataPie,
		        }]
		    },
		    options: {
		    }
		});
	}
}

function setBreweryMenu(){

	$("#brewerySelect").empty();
	for(var i = 0; i < breweries.length; i++){
		$("#brewerySelect").append("<option>"+breweries[i].name+"</option>")
		
	}
	var loc = breweries.map(function(x) {return x.name}).indexOf($("#brewerySelect option:selected" ).text());
	readBeerList(loc);
	//console.log(brewery)
	//$(".beer").empty();
	//$(".beer").append(brewery.beerOptions);
	
}
function fillBeerMenu(){
	$("#brewerySelect" ).change(function() {
			var loc = breweries.map(function(x) {return x.name}).indexOf($("#brewerySelect option:selected" ).text());
			readBeerList(loc);
	});
}

function addButton(){
	
	$("#addBeer").click(function (){
		//console.log($("#brewerySelect option:selected" ).text());
		var loc = breweries.map(function(x) {return x.name}).indexOf($("#brewerySelect option:selected" ).text());
		var brewery = breweries[loc];
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






function breweryList(){
	breweries = [];
	var textInput = $('#brewerySearchInput').val();
	connectionString = "https://api.untappd.com/v4/search/brewery?access_token=58BFAE75D0393B7ED61DAF2C806CC7F89F755870&q=" + textInput;
	$.getJSON(connectionString, function(data) {
		for(var i = 0; i < data.response.brewery.items.length; i++){
			breweries.push(new brewery(data.response.brewery.items[i].brewery.brewery_name, data.response.brewery.items[i].brewery.brewery_id));
		}
		
		setBreweryMenu();
	});
};


function readBeerList(breweryLoc, offset = 0){
	if(offset == 0) {
		start();
	}
	console.log("new readBeer");
	console.log("offset:" + offset);
	var newOffset = offset;
	var connectionString = "";
	connectionString = "https://api.untappd.com/v4/search/beer?access_token=58BFAE75D0393B7ED61DAF2C806CC7F89F755870&limit=50&offset="+offset+"&q="+breweries[breweryLoc].name;
	$.getJSON(connectionString, function(data) {
		
		for(var i = 0; i < data.response.beers.items.length; i++){
		  	breweries[breweryLoc].addBeer(
		  			new Beer(data.response.beers.items[i].beer.beer_name, 
		  					data.response.beers.items[i].beer.bid,
		  					data.response.beers.items[i].beer.rating_score)
		  	);
		  	newOffset++;
		};
		console.log("newoffset:" + newOffset);
		if(data.response.beers.count<50) {
			finish();
		} else {
			readBeerList(breweryLoc,offset = newOffset);
		}
	});
	function finish() {
		$(".beer").append(breweries[breweryLoc].beerOptions);
	}
	function start() {
		$(".beer").empty();
	}
};

function findBreweryButton() {
	$("#findBreweryButton").click(function (){
		breweryList();
	});
}

$(document).ready(function(){
	
	breweryList();
	addButton();
	findBreweryButton();
	fillBeerMenu();
	makeGraph();
	//readBeerActivity();
	$("#happy").empty();
	
	
});

