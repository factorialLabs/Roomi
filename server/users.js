Meteor.publish("users", function () {
  return Meteor.users.find({}, {fields: {emails: 1, profile: 1}});
});
Meteor.publish("userData", function () {
  return Meteor.users.find({_id: this.userId},
                           {fields: {'group': 1}});
});
Meteor.users.allow({
    update: function(userId, doc){
        return doc._id === userId; // can update their own profile
    }
});
