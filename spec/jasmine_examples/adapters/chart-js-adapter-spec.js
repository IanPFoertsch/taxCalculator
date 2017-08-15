
describe('ChartJSAdapter', function() {
  var input = [{ a: 1, b: 2 }, { a: 2, b: 3 }];
  var result;


  describe('lineChartConversion', () => {
    beforeEach(() => {
      result = ChartJSAdapter.lineChartConversion(input);
    });

    it('should convert to a series of data for each variable', () => {
      var expectedKeys = Object.keys(input[0]);
      expectedKeys.forEach((key) => {
        expect(Object.keys(result)).toContain(key);
      });
    });

    it('should format the data to {x: _, y: _} format', () => {
      expect(result.a[0]).toEqual({ x:0, y: 1 });
      expect(result.a[1]).toEqual({ x:1, y: 2 });
    });
  });

  describe('stackedBarChartConversion', () => {
    beforeEach(() => {
      result = ChartJSAdapter.stackedBarChartConversion(input);
    });

    it('should have an array of labels, one for each time period', () => {
      expect(result.labels).toEqual(['Year 0', 'Year 1']);
    });

    it('should have a data field for each value', () => {
      expect(result.datasets[0].data).toEqual([1, 2]);
      expect(result.datasets[1].data).toEqual([2, 3]);
    });
  });
});
