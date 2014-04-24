(function() {
    'use strict';

    angular.module('eventsApp').controller('SponsorCreateCtrl', function($scope, $stateParams, Event, Sponsor, $http, API_EVENTS, API_IMAGES, $translate, $state, WorldSkills, $upload, $q) {
        var logo = $q.when();
        $scope.sponsor = new Sponsor();
        $scope.sponsor.event = Event.get({id: $stateParams.eventId});
        $scope.onFileSelect = function($files) {
            var deferred = $q.defer();
            logo = deferred.promise;
            $scope.upload = $upload.upload({
                url: API_IMAGES,
                data: {entity: $scope.sponsor.event.entity.id},
                file: $files[0],
            }).success(function(data, status, headers, config) {
                deferred.resolve(data);
            });
        };
        $scope.save = function() {
            $scope.submitted = true;
            logo.then(function (logo) {
                if ($scope.form.$invalid) {
                    angular.element($scope.form).find('.ng-invalid' ).focus();
                    return;
                }
                $scope.loading = true;
                if (typeof logo != 'undefined') {
                    $scope.sponsor.logo = {id: logo.id};
                }
                $scope.sponsor.$save(function () {
                    $state.go('event.sponsors', {id: $scope.sponsor.event.id});
                });
            });
        };
    });

    angular.module('eventsApp').controller('SponsorCtrl', function($scope, $stateParams, Sponsor, $http, API_EVENTS, API_IMAGES, $translate, $state, WorldSkills, $upload, $q) {
        var logo = $q.when();
        $scope.id = $stateParams.id;
        $scope.sponsor = Sponsor.get({id: $scope.id}, function (sponsor) {
            $scope.title = sponsor.name;
            if (typeof sponsor.logo != 'undefined') {
                $scope.logoImage = WorldSkills.getLink(sponsor.logo.links, 'alternate');
            }
        });
        $scope.removeLogo = false;
        $scope.onFileSelect = function($files) {
            var deferred = $q.defer();
            logo = deferred.promise;
            $scope.upload = $upload.upload({
                url: API_IMAGES,
                data: {entity: $scope.sponsor.event.entity.id},
                file: $files[0],
            }).success(function(data, status, headers, config) {
                deferred.resolve(data);
            });
        };
        $scope.save = function() {
            $scope.submitted = true;
            logo.then(function (logo) {
                if ($scope.form.$invalid) {
                    angular.element($scope.form).find('.ng-invalid' ).focus();
                    return;
                }
                $scope.loading = true;
                if (typeof logo != 'undefined') {
                    $scope.sponsor.logo = {id: logo.id};
                } else if ($scope.removeLogo) {
                    delete $scope.sponsor.logo;
                }
                $scope.sponsor.$update(function () {
                    $state.go('event.sponsors', {id: $scope.sponsor.event.id});
                });
            });
        };
        $scope.deleteSponsor = function() {
            $scope.deleteLoading = true;
            $scope.sponsor.$delete(function () {
                alert('The Sponsor has been deleted successfully.');
                $state.go('event.sponsors', {id: $scope.sponsor.event.id});
            });
        };
    });

})();