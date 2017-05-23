'use strict';

describe('Controller: ClienteListadoCtrl', function () {

  // load the controller's module
  beforeEach(module('appApp'));

  var ClienteListadoCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ClienteListadoCtrl = $controller('ClienteListadoCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ClienteListadoCtrl.awesomeThings.length).toBe(3);
  });
});
