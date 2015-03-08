Meteor.methods({
    set_status: function (status) {
        check(status, String);
        if(status == null){
            status = "Online";
        }
        Meteor.users.update(Meteor.userId(), { $set: { 'profile.status': status}});
    },
    findRoommates: function(groupId){
        var roommates = Meteor.users.find({'profile.group':groupId}, {fields: {emails: 1, profile: 1, group: 1, balance: 1}}).fetch();
        return roommates;
    }
});
