angular.module('rateApp').controller('HomeCtrl', ['$scope', '$http', '$location', 'coursesListener',
  function($scope, $http, $location, coursesListener) {
    $scope.collapse = false;
    $scope.formData = {
      name: null
    };
    $scope.errorMessage = '';
    $scope.successMessage = '';
    $scope.comments = coursesListener.setCourses();

    $scope.$watch(function() {
        return coursesListener.getCourses();
      },
      function (newValue) {
        if (newValue) {
          $scope.courses = newValue;
        }
    });

    $scope.isCollapsing = function() {
      $scope.collapse = true;
    };

    $scope.isUncollapsing = function() {
      $scope.collapse = false;
    };

    $scope.submitCourse = function(isValid) {
      if(isValid) {
        $http.post('/api/course', $scope.formData).
          success(function(data) {
            if(!data.success) {
              $scope.errorMessage = data.message;
              $scope.successMessage = '';
            }
            else {
              coursesListener.setCourses();
              $scope.errorMessage = '';
              $scope.successMessage = data.message;
            }
          });
      }
    };

    $scope.isErrorMessage = function() {
      if($scope.errorMessage == '')
        return false;
      return true;
    };

    $scope.isSuccessMessage = function() {
      if($scope.successMessage == '')
        return false;
      return true;
    };

    $scope.logout = function() {
      $http.get('/logout').
        success(function(data) {
          console.log(data);
          $location.url('/login');
        }).
        error(function(data) {
          console.log(error);
        });
    };
  }]);
