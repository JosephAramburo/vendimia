'use strict';

describe('Service: TipoAbonos', function () {

  // load the service's module
  beforeEach(module('appApp'));

  // instantiate service
  var TipoAbonos;
  beforeEach(inject(function (_TipoAbonos_) {
    TipoAbonos = _TipoAbonos_;
  }));

  it('should do something', function () {
    expect(!!TipoAbonos).toBe(true);
  });

});
