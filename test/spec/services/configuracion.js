'use strict';

describe('Service: Configuracion', function () {

  // load the service's module
  beforeEach(module('appApp'));

  // instantiate service
  var Configuracion;
  beforeEach(inject(function (_Configuracion_) {
    Configuracion = _Configuracion_;
  }));

  it('should do something', function () {
    expect(!!Configuracion).toBe(true);
  });

});
