angular.module("roomi").controller("ChatController", ['$scope', '$meteor', '$rootScope','accountService',
    function($scope, $meteor, $rootScope, accountService){

        accountService.then(function(data){
            console.log(data);
            $scope.messages = $meteor.collection(function() {
                  return Conversation.find({_id: data.group.conversationId}, {
                    sort : $scope.getReactively('sort')});


            });

            $scope.identifyUser = function(msg){
                var members = data.members;
                for(i in members){
                    if(msg.user == data.user._id){
                            return {
                                isUser:true,
                                userName : data.user.profile.name
                            };
                    }
                    else{
                        for(j in members){
                            if(msg.user == members[j]._id){
                                return {
                                        isUser:false,
                                        userName : members[j].profile.name
                                };
                            }
                        }
                    }
                }
            }
        },function(err){
    });
    //subscribe to conversations
    $meteor.autorun($scope, function() {
      $meteor.subscribe('Conversation', {
        limit: 10
      }).then(function(){
           var elem = document.getElementById('chat_box');
            elem.scrollTop = elem.scrollHeight;
      });
    });

    //method called when the user says something
    $scope.say = function(message){
      $meteor.call('say', message).then(
        function(data){
            var elem = document.getElementById('chat_box');
            elem.scrollTop = elem.scrollHeight;
            var elem2 = document.getElementById('small_chat_box');
            elem2.scrollTop = elem2.scrollHeight;
          console.log('success responding', data);
        },
        function(err){
          console.log('failed', err);
        }
      );
    };
}]);
