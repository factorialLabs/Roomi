
Todolist = new Meteor.Collection('Todolist');

Meteor.methods({
    create_list: function (listInfo) {
        check(listInfo, Object);

        Todolist.insert({todos: [{name: listInfo.namel, checked: listInfo.checked, date: date.description}]},
        function(err,todo){
            if(!err){
                //automatically associate  current user to the group
                Meteor.group.update(Meteor.groupId(), { $set: { group: group }});
            }
        })
    },
    join_group: function (groupId) {
        check(groupId, String);
        if (!this.userId)
          throw new Meteor.Error(403, "You must be logged in to join a group");
        var group = Group.findOne(groupId);
        if (!group)
          throw new Meteor.Error(404, "No such group");
        console.log(Meteor.user().group);
        if (_.contains(groupId, Meteor.user().group))
          throw new Meteor.Error(400, "Already in group");
        //Ready to join!
        Meteor.users.update(Meteor.userId(), { $set: { group: groupId }});
        return group;
  }
});