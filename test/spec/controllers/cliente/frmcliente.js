'use strict';

describe('Controller: ClienteFrmclienteCtrl', function () {

  // load the controller's module
  beforeEach(module('appApp'));

  var ClienteFrmclienteCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ClienteFrmclienteCtrl = $controller('ClienteFrmclienteCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ClienteFrmclienteCtrl.awesomeThings.length).toBe(3);
  });
});
