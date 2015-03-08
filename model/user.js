Meteor.methods({
    set_status: function (status) {
        check(status, String);
        if(status == null){
            status = "Away";
        }
        Meteor.users.update(Meteor.userId(), { $set: { 'profile.status': status}});
    },
    findRoommates: function(groupId){
        var roommates = Meteor.users.find({'profile.group':groupId}, {fields: {emails: 1, profile: 1, group: 1, balance: 1}}).fetch();
        return roommates;
    },
    getPayPair: function(payerId, payeeId, balanceString){
        var payer = Meteor.users.findOne({_id:payerId});
        var payee = Meteor.users.findOne({_id:payeeId});
        return [payer, payee, balanceString];
    },
    updateBalance: function(payer, payee){
        Meteor.users.remove({_id:payee._id});
        Meteor.users.insert(payee);
        Meteor.users.remove({_id:payer._id});
        Meteor.users.insert(payer);

        return [payer, payee];
    }
});
