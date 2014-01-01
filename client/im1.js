if (Meteor.isClient) {
    Outfits = new Meteor.Collection("outfits");


  Template.hello.greeting = function () {
    return "Welcome to im1.";
  };



  Template.myOutfits.outfits = function () {
    return Outfits.find({});
  };




  Template.myOutfits.numOutfits = function () {

    return Outfits.find({}).count();

  };



  Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
        Meteor.call('serverButton');
    }
  });

    Template.outfit.events({
    'click .delete': function () {
      console.log("you clicked delete on " + JSON.stringify(this));
      Outfits.remove(this._id);
    } 
  });
}

