if (Meteor.isClient) {
  Outfits = new Meteor.Collection("outfits");


  Template.myOutfits.outfits = function () {

    var finder = {}
    if (!Session.equals('viewingOutfits', "")){
      finder = {user: Session.get('viewingOutfits')};
    }
    return Outfits.find(finder);
  };



  Template.myOutfits.numOutfits = function () {
    return Outfits.find({}).count();
  };


  Template.myOutfits.numViewingOutfits = function () {
    return Outfits.find({user: Session.get('viewingOutfits')}).count();
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
      Session.set("selectedOutfit", this._id);
    } 
  });


  // Helpers

Handlebars.registerHelper('if_eq', function(context, options) {
  if (context == options.hash.compare)
    return options.fn(this);
  return options.inverse(this);
});


}

