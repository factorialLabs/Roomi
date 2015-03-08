Meteor.methods({
    set_status: function (status) {
        check(status, String);
        if(status == null){
            status = "Online";
        }
        Meteor.users.update(Meteor.userId(), { $set: { 'profile.status': status}});
    }
});
