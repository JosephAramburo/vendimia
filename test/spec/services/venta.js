'use strict';

describe('Service: Venta', function () {

  // load the service's module
  beforeEach(module('appApp'));

  // instantiate service
  var Venta;
  beforeEach(inject(function (_Venta_) {
    Venta = _Venta_;
  }));

  it('should do something', function () {
    expect(!!Venta).toBe(true);
  });

});
