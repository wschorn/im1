if (Meteor.isClient) {


  Meteor.startup(function () {
    Session.set('viewingOutfits', "");
  });

  Outfits = new Meteor.Collection("outfits");


  Template.myOutfits.outfits = function () {

    var finder = {};
    if (!Session.equals('viewingOutfits', "")){
      //finder = {user: Session.get('viewingOutfits')};
      var query = Session.get('viewingOutfits');
      var finder = { $or: [
        { 'user': {$regex: query, $options: 'i'}},
        { 'name': {$regex: query, $options: 'i'}},
        { 'garments.title': {$regex: query, $options: 'i'}}
        ]};

    }
    var resultsLimit = 10;
    Session.set("selectedOutfit", null);
    Session.set("query", finder);
    return Outfits.find(finder, {limit: resultsLimit});
  };



  Template.myOutfits.numOutfits = function () {
    return Outfits.find({}).count();
  };


  Template.myOutfits.numViewingOutfits = function () {
    return Outfits.find(Session.get("query")).count();
  };

  Template.myOutfits.viewingOutfits = function () {
    return Session.get('viewingOutfits');
  };






  Template.outfit.outfitClass = function() {
    return Session.equals("selectedOutfit", this._id) ?
      "selected" : "";
  };





  Template.fetchOutfitForm.events({
    'submit form': function(event, template) {
        event.preventDefault();
        var bundleUrl = template.find(".form_url").value;
        console.log("getting o for: " + bundleUrl);
        Meteor.call('fetchOutfitFromBundle', bundleUrl, function (error, result) {
          if(!error){
            Outfits.insert(result);
          }else{
            console.error(error);
          }

        });
    }
});



  Template.fetchUserOutfits.events({
    'submit form': function(event, template) {
        event.preventDefault();
        var userName = template.find(".form_url").value;
        console.log("getting o for: " + userName);
        Session.set('viewingOutfits', userName);
    }
});


    Template.outfit.events({
    'click .delete': function () {
      console.log("you clicked delete on " + JSON.stringify(this));
      Outfits.remove(this._id);
    },
    'click': function () {
      if(!Session.equals("selectedOutfit", this._id)){
      Session.set("selectedOutfit", this._id);
    }else{
          Session.set("selectedOutfit", null);
    }
    } 
  });


  // Helpers

Handlebars.registerHelper('if_eq', function(context, options) {
  if (context == options.hash.compare)
    return options.fn(this);
  return options.inverse(this);
});


Handlebars.registerHelper('pluralize', function(number, singular, plural) {
  if(number == 1){
    return singular
  }else{
    return plural
  }
});


}

