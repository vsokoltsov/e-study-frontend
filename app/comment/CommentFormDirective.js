import template from './comment_form.html';

commentsFormDirective.$inject = ['CommentFactory', '$location', 'currentUserFactory'];

export default function commentsFormDirective(CommentFactory, $location, currentUserFactory) {
  return {
    restrict: "E",
    template: template,
    replace: true,
    scope: false,
    link: function($scope, element, attrs) {
      $scope.currentUser = currentUserFactory.getUser();
      $scope.commentText = '';
      $scope.formComment = {};
      $scope.emptyInfo = emptyInfo();

      $scope.createComment = function() {
        makeComment();
      };

      $scope.trixInitialize = function(e, editor) {

      }

      function emptyInfo() {
        const keys = Object.keys($scope.currentUser).length;
        return keys === 1 && keys.first === 'studying_courses';
      }

      function makeComment() {
        let promise = {};
        const params = {
          text: $scope.commentText,
          id: $scope.object.id,
          type: $scope.type
        };


        if ($scope.formComment.id) {
          $scope.formComment.text = $scope.commentText;
          promise = CommentFactory.update($scope.formComment.id, params)
        }
        else {
          promise = CommentFactory.create(params)
        }

        promise
        .then((comment) => {
          $scope.formComment.id ? successUpdateCallback(comment) :  successCreateCallback(comment);
        })
        .catch((error) => {
          $scope.commentForm.$submitted = true;
          $scope.commentForm.$errors = error;
          $scope.commentForm.$invalid = true;
          console.log($scope.commentForm);
        });
      }

      function successUpdateCallback(comment) {
        let ids = $scope.comments.map(v => v.id);
        let index = ids.indexOf($scope.formComment.id);
        $scope.comments.splice(index, 1, $scope.formComment)
        if ($location.hash() !== $scope.formComment.id ) {
            $location.hash($scope.formComment.id);
        }
        $scope.commentText = null;
        $scope.formComment = {};
        $location.hash();
      }

      function successCreateCallback(comment) {
        $scope.comments.unshift(comment);
        $scope.commentText = '';
      }
    }
  };
}
