Meteor.publish('Group', function() {
  return Group.find();
})
