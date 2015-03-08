
Todolist = new Meteor.Collection('Todolist');

Meteor.methods({
    create_todolist: function (listInfo) {
        check(listInfo, Object);

        Todolist.insert({todos: [{name: listInfo.name, checked: listInfo.checked, date: listInfo.date}]},
        function(err,todolist){
            if(!err){
                //automatically associate  current group todolist
                console.log(Meteor.users.findOne(Meteor.userId()).profile.group);
                Group.update(Meteor.users.findOne(Meteor.userId()).profile.group, { $set: { todolist: todolist }});
            }
        })
    },
    add: function(todoInfo) {
        var group = Group.findOne(Meteor.user().profile.group);
        //Check user is login
        if(!this.userId)
            throw new Meteor.Error(403, "You must be logged in to publish a message");
        //Check if group exists TODO fix this
        if(!group)
            throw new Meteor.Error(404, "No such group");
        //Check if the user is in the group
        if(Meteor.user().profile.group !== group._id)
            throw new Meteor.Error(400, "You are not in the group");

        //Get the conversation in the group
        var todolistId;
        var todos = [];
        if(group.todolist){
            todolistId = group.todolist;

        }


        var new_todo = {
            name:todoInfo.name,
            checked: false,
            date: todoInfo.date
        }
        console.log(Todolist.findOne(todolistId));
        todos = Todolist.findOne(todolistId).todos;
        todos.push(new_todo);
        Todolist.update(
            todolistId,
            {$set:{todos:todos}}
        );
    }
});
