
describe('ChartJSAdapter', function() {
  var input = [{ a: 1, b: 2 }, { a: 2, b: 3 }];
  var result;

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
