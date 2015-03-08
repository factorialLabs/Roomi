Meteor.publish("Todolist", function () {
  return Meteor.Todolist.find({}, {fields: {todos: 1}});
});
