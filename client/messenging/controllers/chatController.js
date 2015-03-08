angular.module("roomi").controller("ChatController", ['$scope', '$meteor', '$rootScope','accountService',
    function($scope, $meteor, $rootScope, accountService){
        //console.log(accountService);
        accountService.then(function(data){
            //console.log(data);
            $scope.messages = $meteor.collection(function() {
                  return Conversation.find({_id: data.group.conversationId}, {
                    sort : $scope.getReactively('sort')});


            });
            $scope.identifyUser = function(msg){
                var members = data.members;
                for(i in members){
                    if(msg.user === data.user._id){
                            return {
                                isUser:true,
                                userName : data.user.emails[0].address
                            };
                    }
                    else{
                        for(j in members){
                            if(msg.user === members[j].user._id){
                                return {
                                        isUser:false,
                                        userName : members[j].user.emails[0].address
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
          console.log('success responding', data);
        },
        function(err){
          console.log('failed', err);
        }
      );
    };
}]);
