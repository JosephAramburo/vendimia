'use strict';

describe('Controller: VentaFrmventaCtrl', function () {

  // load the controller's module
  beforeEach(module('appApp'));

  var VentaFrmventaCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    VentaFrmventaCtrl = $controller('VentaFrmventaCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(VentaFrmventaCtrl.awesomeThings.length).toBe(3);
  });
});
