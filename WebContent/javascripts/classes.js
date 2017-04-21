class brewery {
	constructor(name,id,beers) {
		this.name = name;
		this.id = id;
		this.beers = beers;
	}
	addBeer(beer) {
		this.beers.append(beer);
	}
	get beerNames() {
		var beerNames = [];
		for(var i = 0; i < this.beers.length; i++){
			beerNames.push(this.beers[i].name)
		}
		
		return beerNames
	}
	get beerRatings() {
		var beerRatings = [];
		for(var i = 0; i < this.beers.length; i++){
			beerRatings.push(this.beers[i].rating)
		}
		
		return beerRatings
	}
	get beerOptions() {
		var optionList = [];
		for(var i = 0; i < this.beers.length; i++){
			optionList.push(this.beers[i].optionString)
		}
		optionList.sort();
		return optionList;
	}
	
}

class beer {
	constructor(name,id,rating) {
		this.name = name;
		this.id = id;
		this.rating = rating;
	}
	
	get optionString() {
		var option;
		option = "<option>"+this.name+"</option>";
		return option;
	}
}