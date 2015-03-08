
Todolist = new Meteor.Collection('Todolist');

Meteor.methods({
    create_todolist: function (listInfo) {
        check(listInfo, Object);

        Todolist.insert({todos: [{name: listInfo.name, checked: listInfo.checked, date: listInfo.date}]},
        function(err,todolist){
            if(!err){
                //automatically associate  current group todolist
                console.log(Meteor.users.findOne(Meteor.userId()).group);
                Group.update(Meteor.users.findOne(Meteor.userId()).group, { $set: { todolist: todolist }});
            }
        })
    },
    add_to_list: function (todoInfo) {
        
    }
});