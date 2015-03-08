angular.module('roomi',['angular-meteor', 'ui.router', 'angularUtils.directives.dirPagination']);

function onReady() {
  angular.bootstrap(document, ['roomi']);
}

if (Meteor.isCordova)
  angular.element(document).on("deviceready", onReady);
else
  angular.element(document).ready(onReady);

