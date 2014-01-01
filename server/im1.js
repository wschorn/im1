if (Meteor.isServer) {
  Outfits = new Meteor.Collection("outfits");
  var Bitly = Meteor.require("bitly-oauth");
  var dummyUser = 'wschornmeteor';

  //During startip, we'll set up a unique user/session ID and let that fill in WHICH bitly account we login to. 
  var b = new Bitly(dummyUser, "throwaway1");


  Meteor.methods({
    serverButton: function () {
      totalClicks++;
      console.log("you pushed a button " + totalClicks + " times.");
      },
    fetchOutfitFromBundle: function(bundleUrl) {
      console.log("starting");
      var newOutfit = {}
      var bundleCallbackFunction = function(err, result){
        if(!err){
          console.log("made: " + newOutfit);
          return newOutfit;
        }else{
          console.error(err);
        }
      };

      // _wrapAsync is undocumented, but I freaking love it. Any of the bitly-oauth methods can be wrapped this way.
      b.bundleSync = Meteor._wrapAsync(b.bundle.contents);
      try {
        var result = b.bundleSync({bundle_link: "http://bitly.com/bundles/wschornmeteor/1"});
        }
      catch(e) {
          console.error(e);
        } 

      console.log("res:" + JSON.stringify(result));
      newGarments = []
      console.log("adding: " + result.data.bundle.links);


      //doing this loop the stupid way, because I'm gonna convert everything to coffeescript soon...soon...
      for(myLink in result.data.bundle.links){

        curr = result.data.bundle.links[myLink];
        newGarments.push({name: curr.title, link: curr.link, color: 'black'});
      }


      newOutfit = {name: result.data.bundle.title, description: result.data.bundle.title, garments: newGarments};

      Outfits.insert(newOutfit);
      // For each bundle, get the bundle contents, each link should be a garment. 

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



    

  //console.log(b);
  b.link.clicks({ link: "http://bit.ly/Ki1L7Y" }, function(err, result){
  // do stuff
    //console.log(result);
});

    //api.add_files(['index.js', '../../packages.json'], 'server');
  });
}