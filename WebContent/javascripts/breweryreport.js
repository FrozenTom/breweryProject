var breweries = [];
var brewerySearchResults = [];
var numBeers=1;


function makeGraph() {
	var ctx1 = document.getElementById("chart1");
	var chart1;
	var brwLocs = [];
	var labels = new Array();
	var datasets = new Array();
	
	$("#submit").click(
		function (){
			brwLocs = [];
			labels = new Array();
			datasets = new Array();
			$( ".brewerySelected" ).each(
				function() {
					console.log("brewery added");
					brwLocs.push(breweries.map(function(x) {return x.id}).indexOf(Number($(this).attr('id'))));
				}
			);
			generateDatasets();
			
			
		}
	);
	function generateDatasets() {
		console.log("generateDatasets called");
		console.log("brwLocs.length =" + brwLocs.length);
		for(var i = 0; i<brwLocs.length;i++) {
			console.log("new dataset created");
			datasets[i] = { 
					label: "dataset " + i,
					data : new Array(),
					borderwidth : 1
			}
		}
		for(var i = 0; i<brwLocs.length; i++) {
			for(var j = 0; j < breweries[brwLocs[i]].checkins.length;j++) {
				var checkin =  breweries[brwLocs[i]].checkins[j];
				if(checkinConstraint(checkin)) {
					if(labels.includes(xAxisValue(checkin))) {
					
						datasets[i].data[labels.indexOf(xAxisValue(checkin))].push(checkin);
					} else {
						labels.push(xAxisValue(checkin));
					
						for(var k=0; k<datasets.length;k++) {
							datasets[k].data.push(new Array());
						}
						datasets[i].data[labels.indexOf(xAxisValue(checkin))].push(checkin);
							
					}
				}
					
				
				
			}
		}
		for(var i = 0; i<datasets.length;i++) {
			for(var j = 0; j<labels.length;j++) {
				datasets[i].data[j] = yAxisCompute(datasets[i].data[j])
			}
		}
		
		if(chart1){
			chart1.destroy();
			ctx1 = document.getElementById("chart1");
		}
		chart1 = new Chart(ctx1, {
		    type: 'bar',
		    data: {
		        labels: labels,
		        datasets: datasets
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
		
	}
	
}
function xAxisValue(checkin) {
	
	var xAxis = $("#xAxis option:selected" ).text(); 
	if(xAxis == "Location") {
		return checkin.venue.venue_name;
	} else if (xAxis == "BeerStyle") {
		return checkin.beer.beer_style;
	} else {
		return "undefined"
	}
}
function yAxisCompute(checkins) {
	var yAxis = $("#yAxis option:selected" ).text();
	var value = 0;
	var categories = new Array();
	var count = 0;
	for (var i = 0; i<checkins.length; i++) {
		if(yAxis == "Beer Rating") {
			
			value += checkins[i].rating_score;
			count ++;
		} else if (yAxis == "numCheckins") {
			
			value++;
			
		} else if (yAxis == "numLocations") {
			
			if(categories.includes(checkins[i].venue.venue_name)) {
			} else {
				categories.push(checkins[i].venue.venue_name);
				value++;
			}
			
		} else if (yAxis == "numBeers") {
			if(categories.includes(checkins[i].beer.beer_name)) {
			} else {
				categories.push(checkins[i].beer.beer_name);
				value++;
			}
			
		} else if (yAxis == "numStyles") {
			if(categories.includes(checkins[i].beer.beer_style)) {
			} else {
				categories.push(checkins[i].beer.beer_style);
				value++;
			}
			
		}
	}
	if(yAxis == "Beer Rating") {
		value = value/count;
	}
	return value;
	
}

function checkinConstraint(checkin) {
	console.log("constraint checker function start")
	var returnValue = true;
	
	$( ".constraint" ).each(
			function() {
				console.log("constraint found");
				var constraintName = $(this).attr('id');
				var quality = $( "#" + constraintName + "quality option:selected" ).text();
				var equality = $( "#" + constraintName + "equality option:selected" ).text();
				var value = $( "#" + constraintName + "value" ).val();
				console.log(constraintName);
				console.log(quality);
				console.log(equality);
				console.log(value);
				
				
				function stringChecker(checkinValue, userValue) {
					if(equality =="Equal") {
						if(checkinValue == userValue) {
						} else {
							returnValue = false;
						}
						
					} else if(equality == "Contain" ) {
						console.log("contain found");
						if(checkinValue.includes(userValue)) {
						} else {
							returnValue = false;
						}
						
					} 
				}
				
				if(quality == "BeerName") {
					console.log("beername found");
					stringChecker(checkin.beer.beer_name,value);
					
				} else if (quality == "BeerStyle") {
					stringChecker(checkin.beer.beer_style,value);
					
				} else if (quality == "BreweryName") {
					stringChecker(checkin.brewery.brewery_name,value);
					
				} 
				
				
				$(this).children('logic').each(
						function() {
							var logicName = (this).attr('id');
							var logicType = $( "#" + logicName + "type option:selected" ).text();
							var logicQuality = $( "#" + logicName + "quality option:selected" ).text();
							var logicEquality = $( "#" + logicName + "equality option:selected" ).text();
							var logicValue = $( "#" + logicName + "value" ).val();
						}
				)
				console.log("constraint checker jqueryEnd")
			}
	);
	console.log("constraint checker function end")
	return returnValue;
	
	
}

function finalValueConstraint(value) {
	
}


function setBreweryMenu(){

	$("#brewerySelect").empty();
	for(var i = 0; i < breweries.length; i++){
		$("#brewerySelect").append("<option>"+breweries[i].name+"</option>")
		
	}
	
}










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
		brewerySearchResults = [];
		var textInput = $('#brewerySearchInput').val();
		connectionString = "https://api.untappd.com/v4/search/brewery?access_token=58BFAE75D0393B7ED61DAF2C806CC7F89F755870&q=" + textInput;
		$.getJSON(connectionString, function(data) {
			for(var i = 0; i < data.response.brewery.items.length; i++){
				brewerySearchResults.push(new brewery(data.response.brewery.items[i].brewery.brewery_name, data.response.brewery.items[i].brewery.brewery_id));
			}
			
			$("#brewerySearchSelect").empty();
			for(var i = 0; i < brewerySearchResults.length; i++){
				$("#brewerySearchSelect").append("<option>"+brewerySearchResults[i].name+"</option>")
				
			}
		});
	});
}

function refreshBeerCheckins() {
	var beerLocs = [];
	var count = 0;
	var drp = $('#reportrange').data('daterangepicker');
	var maxCount = 0;
	
	$("#refreshActivity").click(function (){

		$( ".brewerySelected" ).each(function( index ) {
			maxCount++
			var brwLoc = breweries.map(function(x) {return x.id}).indexOf(Number($(this).attr('id')))
			console.log(brwLoc);
			breweryActivityAPI(breweries[brwLoc]);
		});
	});
	function breweryActivityAPI(brewery, startID = 0) {
		//need to implement brewery oldest function. Should utilize beer oldest
		if(brewery.oldest.getTime() < new Date(drp.startDate).getTime()) {
			var oldestOkay = true;
		}
		var done = false;
		var connectionString = "https://api.untappd.com/v4/brewery/checkins/"+brewery.id+"?access_token=58BFAE75D0393B7ED61DAF2C806CC7F89F755870";
		
		if(startID != 0) {
			connectionString = "https://api.untappd.com/v4/brewery/checkins/"+brewery.id+"?max_id="+startID+"&access_token=58BFAE75D0393B7ED61DAF2C806CC7F89F755870"
		}
		var newStartID = 0;
		$.getJSON(connectionString, function(json) {
			for(var i = 0; i < json.response.checkins.items.length; i++){
				if (brewery.checkins.filter(function(checkin) {return checkin.checkin_id == json.response.checkins.items[i].checkin_id;}).length == 0) {
					brewery.addCheckin(json.response.checkins.items[i]);
				}
				newStartID = json.response.checkins.items[i].checkin_id;
				if(new Date(json.response.checkins.items[i].created_at).getTime() <= new Date(drp.startDate).getTime()) {
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
				breweryActivityAPI(brewery, startID = newStartID);
				console.log("more beer data collection called");
			}
			if(count == maxCount) {
				console.log("all beer data collection finished");
				count = 0;
			}
	
		});
	}
}

function addBrewery() {
	//var loc = 5;
	$("#addBreweryButton").click(function (){
		var loc = brewerySearchResults.map(function(x) {return x.name}).indexOf($("#brewerySearchSelect option:selected" ).text());
		breweries.push(brewerySearchResults[loc]);
		secondStep();
		
		
	});
	function secondStep() {
		$("#breweryRows").append(
				`<div class="form-group row brewerySelected" id="` + breweries[breweries.length-1].id + `">
					<label for="example-text-input" class="col-2 col-form-label">` + breweries[breweries.length-1].name + `</label>
					<div class="form-group">
						<input class="btn btn-primary" type="button" value="Remove" id="removeBeer` + breweries[breweries.length-1].id + `" data-id="`+breweries[breweries.length-1].id+`">
					</div>
				</div>
				`
		);
		$("#removeBeer" + breweries[breweries.length-1].id).click(function (){
			var name = $(this).data('id');
			$("#"+name).remove();
		});
	}

}
function addConstraint() {
	var id = 0;
	var logic = 0;
	$("#addConstraint").click(function (){
		id++;
		$("#constraintRows").append(
				`
				
		<div class="constraint" id="constraint` + id + `">
			<div class="form-group row" id="constraint` + id + `base">
				<div class="form-group">
					<label for="example-text-input" class="col-2 col-form-label">constraint</label>
				</div>
				<div class="form-group">
					<select class ="form-control" id ="constraint` + id + `quality">
						<option>Lat</option>
						<option>Long</option>
						<option>BeerName</option>
						<option>BeerStyle</option>
						<option>BreweryName</option>
						<option>numCheckins</option>
					</select>
				</div>
				<div class="form-group">
					<select class ="form-control" id ="constraint` + id + `equality">
						<option>Greater Than</option>
						<option>Less Than</option>
						<option>Equal</option>
						<option>Not</option>
						<option>Contain</option>
					</select>
				</div>
				<div class="form-group">
					<input class ="form-control" type="search" value ="0" id ="constraint` + id + `value">
				</div>
			</div>
			<div class="logic" id="constraint` + id + `logic">
			</div
			<div class="form-group row" id="constraint5baseButtons">
				<div class="form-group">
					<input class="btn btn-primary" type="button" value="Add Logic" id="constraint` + id + `addLogic" data-id="` + id + `">
				</div>
				<div class="form-group"> 
					<input class="btn btn-primary" type="button" value="Remove Constraint" id="constraint` + id + `remove" data-id="` + id + `">
				</div>
				
			</div>
		</div>
				
				`			
		);
		$("#constraint"+id+"remove").click(function (){
			var name = $(this).data('id');
			$("#constraint"+name).remove();
		});
		$("#constraint"+id+"addLogic").click(function (){
			logic++;
			var name = $(this).data('id');
			$("#constraint" + name + "logic").append(
					`
					
			<div class="form-group row" id="constraint` + name + `logic` + logic + `">
				<div class="form-group">
					<select class ="form-control" id ="constraint` + name + `logic` + logic + `type">
						<option>AND</option>	
						<option>OR</option>
					</select>
				</div>
				<div class="form-group">
					<select class ="form-control" id ="constraint` + name + `logic` + logic + `quality">
						<option>Lat</option>
						<option>Long</option>
						<option>BeerName</option>
						<option>BreweryName</option>
						<option>BeerStyle</option>
						<option>numCheckins</option>
					</select>
				</div>
				<div class="form-group">
					<select class ="form-control" id ="constraint` + name + `logic` + logic + `equality">
						<option>Greater Than</option>
						<option>Less Than</option>
						<option>Equal</option>
						<option>Not</option>
						<option>Contain</option>
					</select>
				</div>
				<div class="form-group">
					<input class ="form-control" type="search" value ="0" id ="constraint` + name + `logic` + logic + `value">
				</div>
				<div class="form-group">
					<input class="btn btn-primary" type="button" value="Remove Logic" id="constraint` + name + `logic` + logic + `remove" data-id="` + name + `" data-logic="` + logic + `">
				</div>
			</div>
					
					`
					
			);
			$("#constraint"+name+"logic"+logic+"remove").click(function (){
				var name = $(this).data('id');
				var logicName = $(this).data('logic');
				$("#constraint"+name+"logic"+logicName).remove();
			});
		});
	});
}


function saveData() {
	$("#save").click(function (){
		console.log("save clicked");
		jsonString = JSON.stringify(breweries);
		$.ajax({
		    url: '/untappedBreweryProject/phpScripts/writeJson.php',
		    data : {'jsonString':jsonString},
		    type: 'POST'
		  });
	});
}

$(document).ready(function(){
	
	
	
	
	saveData(); //good
	addBrewery(); //in testing (seems good)
	addConstraint() //new (seems good)
	findBreweryButton(); //good
	makeGraph();
	//readBeerActivity();
	$("#happy").empty();
	refreshBeerCheckins();
	
});

