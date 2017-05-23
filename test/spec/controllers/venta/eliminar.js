'use strict';

describe('Controller: VentaEliminarCtrl', function () {

  // load the controller's module
  beforeEach(module('appApp'));

  var VentaEliminarCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    VentaEliminarCtrl = $controller('VentaEliminarCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(VentaEliminarCtrl.awesomeThings.length).toBe(3);
  });
});
