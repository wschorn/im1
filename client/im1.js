if (Meteor.isClient) {


  Meteor.startup(function () {
    Session.set('viewingOutfits', "");
    Session.set('lastOutfitViewed', 0);
        if (Garments.find().count() === 0) {
        var garment1 = {name:'shirt', color:'black'};
        var garment2 = {name:'shirt', color:'white'};
        var garment3 = {name:'jeans', color:'black'};
        var garment4= {name:'jeans', color:'blue'};
        var garment3 = {name:'sweater', color:'black'};
        var garment4= {name:'jacket', color:'brown'};


        Garments.insert(garment1);
        Garments.insert(garment2);
        Garments.insert(garment3);
        Garments.insert(garment4);
        Garments.insert(garment5);
        Garments.insert(garment6);


      }

  });

  Outfits = new Meteor.Collection("outfits");
  Garments = new Meteor.Collection("garments");



  Template.myGarments.garments = function () {

    var finder = {};
    // if (!Session.equals('viewingOutfits', "")){
    //   //finder = {user: Session.get('viewingOutfits')};
    //   var query = Session.get('viewingOutfits');
    //   var finder = { $or: [
    //     { 'user': {$regex: query, $options: 'i'}},
    //     { 'name': {$regex: query, $options: 'i'}},
    //     { 'garments.name': {$regex: query, $options: 'i'}}
    //     ]};

    // }
    var resultsLimit = 10;
    //Session.set("selectedOutfit", null);
    //Session.set("query", finder);
    return Garments.find(finder, {limit: resultsLimit});
  };


  Template.myOutfits.outfits = function () {

    var finder = {};
    if (!Session.equals('viewingOutfits', "")){
      //finder = {user: Session.get('viewingOutfits')};
      var query = Session.get('viewingOutfits');
      var finder = { $or: [
        { 'user': {$regex: query, $options: 'i'}},
        { 'name': {$regex: query, $options: 'i'}},
        { 'garments.name': {$regex: query, $options: 'i'}}
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


// red is only garments newer than the last garment we clicked, which is in our session.
  Template.outfit.outfitColor = function() {
    return (Session.get("lastOutfitViewed") < this.ts_ago) ?
      "red" : "gray";
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
    'click .outfit': function () {
      if(!Session.equals("selectedOutfit", this._id)){
      Session.set("selectedOutfit", this._id);
      if(Session.get("lastOutfitViewed") < this.ts_ago){
        Session.set("lastOutfitViewed", this.ts_ago);
      }
    }else{
          Session.set("selectedOutfit", null);
    }
    },
    'click .user_outfits' : function (event, template) {
      var target = event.target.getAttribute("data-user");
      console.log(target);
      Session.set('viewingOutfits', target);
    } 
  });



//       with function(event, tempalte)  console.log(event.target.getAttribute("data-id"));
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


Handlebars.registerHelper('ts_ago', function( timestamp ) {
  
  return moment.unix(timestamp).fromNow() + " " + timestamp;

});



}

