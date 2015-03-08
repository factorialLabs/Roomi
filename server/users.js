Meteor.publish("users", function () {

    if(!this.userId) return null;
    return Meteor.users.find({}, {fields: {emails: 1, profile: 1, group: 1}});
});
Meteor.users.allow({
    update: function(userId, doc){
        return doc._id === userId; // can update their own profile
    }
});
