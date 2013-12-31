if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return "Welcome to im1.";
  };



    Template.outfit.outfitName = function () {
    return "naked";
  };

  Template.outfit.garments = function () {
    return [{name:'shirt', color:'black'}, {name:'pants', color:'blue'}];
  };

  Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
        Meteor.call('serverButton');
    }
  });
}

