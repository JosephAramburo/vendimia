'use strict';

describe('Service: Articulo', function () {

  // load the service's module
  beforeEach(module('appApp'));

  // instantiate service
  var Articulo;
  beforeEach(inject(function (_Articulo_) {
    Articulo = _Articulo_;
  }));

  it('should do something', function () {
    expect(!!Articulo).toBe(true);
  });

});
