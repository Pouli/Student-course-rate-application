angular.module('rateApp').controller('Home2Ctrl', ['$scope', '$http', '$location', '$routeParams', 'commentsListener',
  function($scope, $http, $location, $routeParams, commentsListener) {
    $scope.collapse = false;
    $scope.formData = {
      mark: null,
      comment: null
    };
    $scope.errorMessage = '';
    $scope.successMessage = '';
    $scope.comments = commentsListener.setComments($routeParams.courseID);

    $scope.$watch(function() {
        return commentsListener.getComments();
      },
      function (newValue) {
        if (newValue) {
          $scope.comments = newValue;
        }
    });

    $scope.submitComment = function(isValid) {
      if(isValid) {
        $http.post('api/comments/' + $routeParams.courseID, $scope.formData).
          success(function(data) {
            if(data.success) {
              commentsListener.setComments($routeParams.courseID);
              $scope.successMessage = data.message;
            }
            else {
              $scope.errorMessage = data.message;
            }
          });
      }
    };

    $scope.isCollapsing = function() {
      $scope.collapse = true;
    };

    $scope.isUncollapsing = function() {
      $scope.collapse = false;
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

    $scope.calculateAverage = function() {
        var sum = 0;
        angular.forEach($scope.comments, function(comment) {
          sum += comment.mark;
        });
        return Math.round((sum/$scope.comments.length)*10) / 10;
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
    }
  }]);
