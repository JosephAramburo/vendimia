'use strict';

describe('Controller: VentaListadoCtrl', function () {

  // load the controller's module
  beforeEach(module('appApp'));

  var VentaListadoCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    VentaListadoCtrl = $controller('VentaListadoCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(VentaListadoCtrl.awesomeThings.length).toBe(3);
  });
});
