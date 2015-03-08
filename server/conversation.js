Meteor.publish('Conversation', function() {
  return Conversation.find();
})
