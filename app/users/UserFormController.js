export default class UserFormController {
    constructor($scope, $state, user, $filter, UserService, Upload){
        this.user = user;
        this.$scope = $scope;
        this.$filter = $filter;
        this.UserService = UserService;
        this.$state = $state;
        $scope.user = user;
        this.Upload = Upload;
        if($scope.user.hasOwnProperty("date_of_birth")){
            $scope.user.date_of_birth = new Date($filter("date")(Date.now(), 'yyyy-MM-dd'));
        }
    }

    update(){
        let user = this.$scope.user;
        console.log(user);
        let userParams = { user: {
            last_name: user.last_name,
            first_name: user.first_name,
            email: user.email,
            middle_name: user.middle_name,
            date_of_birth: user.date_of_birth,
            description: user.description
        }};
        if(user.image){
            userParams.user.image = {
                imageable_type: "User",
                id: user.image.id
            };
        }
        this.UserService.update(user.id, userParams)
        .then((data) => {
            this.$state.go('user', {id: data.id});
        })
        .catch((errors) => {
            this.$scope.userForm.$submitted = true;
            this.$scope.userForm.$errors = errors;
            this.$scope.userForm.$invalid = true;
        });
    }

    upload(file){
        this.Upload.upload({
            url: 'http://localhost:3000/api/v0/images',
            fields: {'imageable_type': "User"},
            file: file
        }).success( (data, status, headers, config) => {
            this.$scope.user.image = data;
        })
    }
}