Conversation = new Meteor.Collection("Conversation");

Conversation.allow({
    insert:function(userId, group){
        //Check if user is one of the group member
        return userId && _.contains(group.members, userId);
    },
    update:function(userId, message){
        return userId && message.userId === userId;
    },
    remove:function(userId, message){
        return userId && message.userId === userId;
    }
});

Meteor.methods({
    //Function to publish a message
    say: function(msg){
        //ConsoleMe.subscribe();
        //check(Meteor.user().group, String);
        //Find the group by using the groupId
        var group = Group.findOne(Meteor.user().group);
        console.log(Meteor.userId);
        console.log(Meteor.user());
        console.log(Meteor.user().group);
        console.log(group);
        //Check if there is a message
        if(!msg)
            throw new Meteor.Error(404, "There is no message");
        //Check user is login
        if(!this.userId)
            throw new Meteor.Error(403, "You must be logged in to publish a message");
        //Check if group exists TODO fix this
        if(!group)
            throw new Meteor.Error(404, "No such group");
        //Check if the user is in the group
        if(Meteor.user().group !== group._id)
            throw new Meteor.Error(400, "You are not in the group");

        //Get the conversation in the group
        var convoId;
        var conversation = [];
        var messages= [];
        if(group.conversationId){
            convoId = group.conversationId;
            conversation = Conversation.findOne(convoId);
        }


        var message = {
            user:this.userId,
            message:msg,
            time: new Date()
        }
        //conversation is empty. Create a convo and create message and publish
        if(!conversation){
            var new_conversation = {
                messages: []
            }
            new_conversation.messages.push(message);
            Conversation.insert(conversation,function(err,id){
                Group.update(group._id, { $set: { conversationId: id }});
            });

        }
        else{
            if(conversation.messages)
                messages = conversation.messages;
            messages.push(message);
            Conversation.update(
                convoId,
                {$set:{"conversation.messages":messages}}
            );
        }
    },
    retrieve:function(){
        //check(Meteor.user().group, String);
        console.log(Meteor.user().group);
        //Find the group by using the groupId
        //Need to verify if the Group variable is accessible
        var group = Group.findOne(Meteor.user().group);
        //Check user is login
        if(!this.userId)
            throw new Meteor.Error(403, "You must be logged in to see the conversation");
        //Check if group exists
        if(!group)
            throw new Meteor.Error(404, "No such group");
        //Check if the user is in the group
        if(Meteor.user().group !== group)
            throw new Meteor.Error(400, "You are not in the group");

        var convoId = group.conversationId;
        var conversation = Conversation.findeOne(convoId);

        return conversation;
    }
});
