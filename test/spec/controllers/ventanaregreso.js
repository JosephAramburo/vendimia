'use strict';

describe('Controller: VentanaregresoCtrl', function () {

  // load the controller's module
  beforeEach(module('appApp'));

  var VentanaregresoCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    VentanaregresoCtrl = $controller('VentanaregresoCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(VentanaregresoCtrl.awesomeThings.length).toBe(3);
  });
});
