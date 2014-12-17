angular.module('rateApp').factory('coursesListener', function($http) {
  var courses;

  return {
    getCourses: function() {
      return courses;
    },

    setCourses: function() {
      $http.get('/api/courses').success(function(data) {
        if(data.success)
          courses = data.courses;
      });
    }
  }
});
