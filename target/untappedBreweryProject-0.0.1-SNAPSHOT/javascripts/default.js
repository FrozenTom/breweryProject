var main = function() {
	console.log("main function called");
	addButton();
};


var addButton = function(){
	console.log("addBeer Clicked");
	$("addBeer").click(function (){
		console.log("addBeer Clicked");
		$("beerRows").append(
		`
		<div class="form-group row">
				<label for="example-text-input" class="col-2 col-form-label">Beer:</label>
				<div class="form-group">
					<select class="form-control" id="exampleSelect1">
				 		<option>1</option>
				     	<option>2</option>
				     	<option>3</option>
				      	<option>4</option>
				      	<option>5</option>
				    </select>
				</div>
		</div>
		`
		);
	});
};	


window.onload = function(){
	main();
}