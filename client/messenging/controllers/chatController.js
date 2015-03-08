angular.module("roomi").controller("ChatController", ['$scope', '$meteor', '$rootScope','accountService',
    function($scope, $meteor, $rootScope, accountService){
        console.log(accountService);
        accountService.then(function(data){
            console.log(data);
            $scope.messages = $meteor.collection(function() {
                  return Conversation.find({_id: data.group.conversationId});
            });
        },function(err){

        });


    //subscribe to conversations
    $meteor.autorun($scope, function() {
      $meteor.subscribe('Conversation', {
        limit: 10
        //skip: (parseInt($scope.getReactively('page')) - 1) * parseInt($scope.getReactively('perPage')),
       // sort: $scope.getReactively('sort')
      });
//    , $scope.getReactively('search')).then(function() {
//        $scope.partiesCount = $meteor.object(Counts ,'numberOfParties', false);
//      });
    });
    //method called when the user says something
    $scope.say = function(message){
      $meteor.call('say', message).then(
        function(data){
          console.log('success responding', data);
        },
        function(err){
          console.log('failed', err);
        }
      );
    };
}]);
