if (Meteor.isServer) {
	Meteor.methods({
  serverButton: function () {
    console.log("you pushed a button great...")
  },

  bar: function () {
    // .. do other stuff ..
    return "baz";
  }
});	

  Meteor.startup(function () {
    // code to run on server at startup
    console.log("I am the server. The server is me.");
    var Bitly = Meteor.require("bitly-oauth");
	var b = new Bitly("wschornmeteor", "throwaway1");
	//console.log(b);
	b.link.clicks({ link: "http://bit.ly/Ki1L7Y" }, function(err, result){
  // do stuff
  	console.log(result);
});

    //api.add_files(['index.js', '../../packages.json'], 'server');
  });
}