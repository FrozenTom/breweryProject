class brewery {
	constructor(name,id) {
		this.name = name;
		this.id = id;
		this.beers = new Array();
	}
	addBeer(beer) {
		this.beers.push(beer);
	}
	emptyBeers() {
		this.beers = new Array();
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

class Beer {
	constructor(name,id,rating) {
		this.name = name;
		this.id = id;
		this.rating = rating;
		this.activity = [];
	}
	addCheckin(checkin) {
		this.activity.push(checkin);
	}
	
	//getRatingFromActivity() {
	//	var tempRating = 0;
	//	for(var i = 0; i<this.activity.length;i++) {
	//		tempRating = tempRating+ this.activity[i].rating;
	//	}
	//	tempRating = tempRating/this.activity.length;
	//	return tempRating;
	//}
	
	emptyCheckin() {
		this.activity = [];
	}
	
	get optionString() {
		var option;
		option = "<option>"+this.name+"</option>";
		return option;
	}
	get oldest() {
		
		var oldest = new Date();
		for( var i = 0; i< this.activity.length; i++) {
			if(new Date(this.activity[i].date).getTime()<oldest.getTime()) {
				oldest = new Date(this.activity[i].date);
			}
		}
		return oldest;
	}
	getActivityBetween(startDate, endDate) {
		var newActivity = [];
		for( var i = 0; i< this.activity.length; i++) {
			if(new Date(this.activity[i].date).getTime()<endDate.getTime() && 
					new Date(this.activity[i].date).getTime()>startDate.getTime()) {
				
				newActivity.push(this.activity[i]);
			}
		}
		return newActivity;
	}
}
class checkin {
	constructor(id,uid,numcomments,numtoasts,rating, date) {
		this.id = id;
		this.uid = uid;
		//this.vid = vid;
		//this.lat = lat
		//this.lon = lon;
		this.numCom = numcomments;
		this.numToasts = numtoasts;
		this.rating = rating;
		this.date = date;
	}
	
}
