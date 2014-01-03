if (Meteor.isServer) {
  Outfits = new Meteor.Collection("outfits");
  Garments = new Meteor.Collection("garments");

  var Bitly = Meteor.require("bitly-oauth");
  var dummyUser = 'wschornmeteor';

  //During startip, we'll set up a unique user/session ID and let that fill in WHICH bitly account we login to. 
  var b = new Bitly(dummyUser, "throwaway1");

  var Helpers = {
    linkToGarment: function (input) {
      return {name: input['title'], link: input['link'], color: 'black'}
    }
  }

  Meteor.methods({
    serverButton: function () {
      totalClicks++;
      console.log("you pushed a button " + totalClicks + " times.");
      },
    fetchOutfitFromBundle: function(bundleUrl) {
      var newOutfit = {}
      // _wrapAsync is undocumented, but I freaking love it. Any of the bitly-oauth methods can be wrapped this way.
      b.bundleSync = Meteor._wrapAsync(b.bundle.contents);
      try {
        var result = b.bundleSync({bundle_link: bundleUrl});
        }
      catch(e) {
          console.error(e);
        } 

      newGarments = []
      //console.log("adding: " + JSON.stringify(result.data.bundle));

      for(var myLink in result.data.bundle.links){
        curr = result.data.bundle.links[myLink];
        ng = Helpers.linkToGarment(curr);
        //ng = {name: curr['title'], link: curr['link'], color: 'black'};
        newGarments.push(ng);
      }
      var rdb = result.data.bundle;
      //currently the user photo is stored in the description. this is janky, eventually we should perhaps pull the first link in the bundle?
      newOutfit = {user: rdb.bundle_owner, name: rdb.title, userPhoto: rdb.description, garments: newGarments, ts_modified: rdb.last_modified_ts};
      return newOutfit;
     },
     fetchGarmentsFromLinkHistory : function (userName) {
        b.historySync = Meteor._wrapAsync(b.bundle.contents);
        try {
          var result = b.historySync({user: userName});
        }
        catch(e) {
          console.error(e);
        } 
        var rdl = result.data.link_history;
        for(var link in rdl){
          curr = result.data.bundle.links[myLink];
          ng = Helpers.linkToGarment(curr);
          Garments.insert(ng);
        }
 
     }

  }); 



  Meteor.startup(function () {
    // code to run on server at startup
    totalClicks = 0;
    console.log("I am the server. The server is me.");

    //insert dummy outfits to play with if we have none.
    // if (Outfits.find().count() === 0) {
    //     var outfit1 = {user: 'bob', name: "not naked", userPhoto: "i dressed myself today", garments: [{name:'shirt', color:'black'}, {name:'pants', color:'blue'}]};
    //     var outfit2 = {user: 'adam', name: "fancy", userPhoto: "something something something 'bout a sharp dressed man", garments: [{name:'shirt', color:'white'}, {name:'slacks', color:'black'}]};     
    //     var outfit3 = {user: 'bob', name: "artsy", userPhoto: "go away", garments: [{name:'shirt', color:'black'}, {name:'skinny jeans', color:'black'}]};
        
    //     Outfits.insert(outfit1);
    //     Outfits.insert(outfit2);
    //     Outfits.insert(outfit3);

    //   }



    //api.add_files(['index.js', '../../packages.json'], 'server');
  });
}