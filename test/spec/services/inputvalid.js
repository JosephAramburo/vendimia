'use strict';

describe('Service: InputValid', function () {

  // load the service's module
  beforeEach(module('appApp'));

  // instantiate service
  var InputValid;
  beforeEach(inject(function (_InputValid_) {
    InputValid = _InputValid_;
  }));

  it('should do something', function () {
    expect(!!InputValid).toBe(true);
  });

});
