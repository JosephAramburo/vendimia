'use strict';

describe('Controller: ClienteEliminarCtrl', function () {

  // load the controller's module
  beforeEach(module('appApp'));

  var ClienteEliminarCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ClienteEliminarCtrl = $controller('ClienteEliminarCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ClienteEliminarCtrl.awesomeThings.length).toBe(3);
  });
});
