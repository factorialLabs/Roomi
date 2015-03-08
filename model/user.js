Meteor.methods({
    set_status: function (status) {
        check(status, String);
        if(status == null){
            status = "Online";
        }
        Meteor.users.update(Meteor.userId(), { $set: { 'profile.status': status}});
    },
    getRoommates: function(groupId){
        console.log(groupId);
        return Meteor.users.find({group:groupId}, {fields: {emails: 1, profile: 1, group: 1, balance: 1}});
    }
});
