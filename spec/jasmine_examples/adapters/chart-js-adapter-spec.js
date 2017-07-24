
describe('ChartJSAdapter', function() {
  var input = [{ a: 1, b: 2 }, { a: 2, b: 3 }];
  var result;
  beforeEach(() => {
    result = ChartJSAdapter.cashFlowConversion(input);
  });

  describe('cashFlowConversion', () => {
    it('should convert to a series of data for each variable', () => {
      var expectedKeys = Object.keys(input[0]);
      expectedKeys.forEach((key) => {
        expect(Object.keys(result)).toContain(key);
      });
    });

    it('should format the data to {x: _, y: _} format', () => {
      expect(result['a'][0]).toEqual({ x:1, y: 0 });
      expect(result['a'][1]).toEqual({ x:2, y: 1 });
    });
  });
});
