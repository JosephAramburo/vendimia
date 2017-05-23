'use strict';

describe('Service: cliente', function () {

  // load the service's module
  beforeEach(module('appApp'));

  // instantiate service
  var cliente;
  beforeEach(inject(function (_cliente_) {
    cliente = _cliente_;
  }));

  it('should do something', function () {
    expect(!!cliente).toBe(true);
  });

});
