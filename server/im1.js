if (Meteor.isServer) {
	 Outfits = new Meteor.Collection("outfits");


	 Helpers = {

	 bundleContentsToOutfit: function(input) {
	 		// For each bundle, get the bundle contents, each link should be a garment. 
	 	var dummy = {name: input.data.bundle.title, description: input.data.bundle.title, garments: [{name:'shirt', color:'black'}, {name:'pants', color:'blue'}]};
	 	return dummy.name;
	 }

}

	Meteor.methods({
  serverButton: function () {
  	totalClicks++;
    console.log("you pushed a button " + totalClicks + " times.");
  }

});	

  Meteor.startup(function () {
    // code to run on server at startup
    totalClicks = 0;
    console.log("I am the server. The server is me.");

    //insert dummy outfits to play with if we have none.
	if (Outfits.find().count() === 0) {
			var outfit1 = {name: "not naked", description: "i dressed myself today", garments: [{name:'shirt', color:'black'}, {name:'pants', color:'blue'}]};
			var outfit2 = {name: "fancy", description: "something something something 'bout a sharp dressed man", garments: [{name:'shirt', color:'white'}, {name:'slacks', color:'black'}]};			
			var outfit3 = {name: "artsy", description: "go away", garments: [{name:'shirt', color:'black'}, {name:'skinny jeans', color:'black'}]};
			
			Outfits.insert(outfit1);
			Outfits.insert(outfit2);
			Outfits.insert(outfit3);

		}

    var Bitly = Meteor.require("bitly-oauth");
    var dummyUser = 'wschornmeteor';

    //Before this, we'll set up a unique user/session ID and let that fill in WHICH bitly account we login to. 
		var b = new Bitly(dummyUser, "throwaway1");

		//Get the bundle from the user, turn that into an outfit
		b.bundle.contents({ bundle_link: "http://bitly.com/bundles/wschornmeteor/1"}, function(err, result){

		if(!err){
		console.log(JSON.stringify("result of bundle call: " + JSON.stringify(result)));


		var newOUtfit = Helpers.bundleContentsToOutfit(result);


		console.log("made: " + Helpers.bundleContentsToOutfit(result));
	}else{
		console.error(err);
	}
	
	})

	//console.log(b);
	b.link.clicks({ link: "http://bit.ly/Ki1L7Y" }, function(err, result){
  // do stuff
  	//console.log(result);
});

    //api.add_files(['index.js', '../../packages.json'], 'server');
  });
}