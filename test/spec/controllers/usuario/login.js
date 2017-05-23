'use strict';

describe('Controller: UsuarioLoginCtrl', function () {

  // load the controller's module
  beforeEach(module('appApp'));

  var UsuarioLoginCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UsuarioLoginCtrl = $controller('UsuarioLoginCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(UsuarioLoginCtrl.awesomeThings.length).toBe(3);
  });
});
