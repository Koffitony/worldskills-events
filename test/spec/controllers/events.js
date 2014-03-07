'use strict';

describe('controllers events', function() {

    // load the module
    beforeEach(module('eventsApp'));

    beforeEach(function() {
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    // catch views and languages requests
    beforeEach(inject(function($httpBackend) {

        $httpBackend.whenGET(/languages\/.*/).respond({
            "AQ": "Antarctica"
        });
        $httpBackend.whenGET(/views\/.*/).respond('');
    }));

    describe('EventsCtrl', function() {

        var $httpBackend, $scope, EventsCtrl;

        // Initialize the controller and a mock scope
        beforeEach(inject(function(_$httpBackend_, $controller, $rootScope) {

            $httpBackend = _$httpBackend_;

            $scope = $rootScope.$new();

            EventsCtrl = function(stateParams) {
                $controller('EventsCtrl', {
                    $scope: $scope,
                    $stateParams: stateParams || {}
                });
            };
        }));

        it('should paginate events', function() {

            EventsCtrl();

            $httpBackend.expectGET('http://localhost:8080/events/events?limit=10&offset=0').respond({
                events: [
                    {
                        name: 'WorldSkills São Paulo 2015'
                    }, {
                        name: 'WorldSkills Leipzig 2013'
                    }
                ]
            });
            $httpBackend.flush();

            expect($scope.events.events.length).toBe(2);

            $scope.changePage(2);

            $httpBackend.expectGET('http://localhost:8080/events/events?limit=10&offset=10').respond({
                events: [
                    {
                        name: 'WorldSkills London 2011'
                    }
                ]
            });
            $httpBackend.flush();

            expect($scope.events.events.length).toBe(1);
        });

        it('should go to page passed by stateParams', function() {

            EventsCtrl({
                page: '2'
            });

            $httpBackend.expectGET('http://localhost:8080/events/events?limit=10&offset=10').respond({
                events: [
                    {
                        name: 'WorldSkills London 2011'
                    }
                ]
            });
            $httpBackend.flush();

            expect($scope.events.events.length).toBe(1);
        });
    });

    describe('EventCtrl', function() {

        var $httpBackend, $scope, $state, EventCtrl;

        // Initialize the controller and a mock scope
        beforeEach(inject(function(_$httpBackend_, $controller, _$state_, $rootScope) {

            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET('http://localhost:8080/events/events/1').respond({
                id: 1,
                name: 'WorldSkills São Paulo 2015'
            });

            $scope = $rootScope.$new();

            $state = _$state_;
            $state.go = jasmine.createSpy();

            EventCtrl = $controller('EventCtrl', {
                $scope: $scope,
                $state: $state,
                $stateParams: {
                    id: 1
                }
            });

            $httpBackend.flush();
        }));

        it('should load event', function() {

            expect($scope.title).toBe('WorldSkills São Paulo 2015');
            expect($scope.event.id).toBe(1);
        });

        it('should delete event', function() {

            $scope.deleteEvent();

            $httpBackend.expectDELETE('http://localhost:8080/events/events/1').respond('');
            $httpBackend.flush();

            expect($state.go).toHaveBeenCalledWith('events');
        });
    });

    describe('EventDetailCtrl', function() {

        var $httpBackend, $scope, EventDetailCtrl;

        // Initialize the controller and a mock scope
        beforeEach(inject(function(_$httpBackend_, $controller, _$state_, $rootScope) {

            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET('http://localhost:8080/events/countries').respond({
                countries: [
                    'AQ'
                ]
            });
            $httpBackend.expectGET('http://localhost:8080/events/entities').respond({
                entities: []
            });

            $scope = $rootScope.$new();

            EventDetailCtrl = $controller('EventDetailCtrl', {
                $scope: $scope
            });

            $httpBackend.flush();
        }));

        it('should load countries', function() {

            expect($scope.countries).toEqualData([
                {
                    code: 'AQ',
                    name: 'Antarctica'
                }
            ]);
        });
    });
});
