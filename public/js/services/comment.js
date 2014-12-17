angular.module('rateApp').factory('commentsListener', function($http) {
  var comments = {};

  return {
    getComments: function() {
      return comments;
    },

    setComments: function(id) {
      $http.get('/api/comments/' + id).success(function(data) {
        if(data.success)
          comments = data.comments;
      });
    }
  }
});
