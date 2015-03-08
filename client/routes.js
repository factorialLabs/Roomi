
angular.module("roomi").config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
function($urlRouterProvider, $stateProvider, $locationProvider){

   $locationProvider.html5Mode(true);

   $stateProvider
       .state('home', {
      
        url: '/',
       templateUrl:'client/home/views/home.ng.html',
       controller:'HomeController'

   })
       .state('parties', {
       url: '/parties',
       templateUrl: 'client/parties/views/parties-list.ng.html',
       controller: 'PartiesListCtrl'
   })
       .state('partyDetails', {
       url: '/parties/:partyId',
       templateUrl: 'client/parties/views/party-details.ng.html',
       controller: 'PartyDetailsCtrl'
   })

   
      .state('registerUser', {
        url: '/user/register/:groupId',
        templateUrl: 'client/accounts/views/user-register.ng.html',
        controller: 'RegisterController'
      })
      .state('registerTodolist', {
         url: '/user/todolist/:groupId',
         templateUrl: 'client/todolists/views/todolist-register.ng.html',
         controller: 'TodolistController'
      })
      .state('chatBox', {
        url: '/chat',
        templateUrl: 'client/messenging/views/chat-box.ng.html',
        controller: 'ChatController'
      });
    $urlRouterProvider.otherwise("/");
  }]);

