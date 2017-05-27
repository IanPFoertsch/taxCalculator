
describe('FutureCalculator', function() {
  describe('projectFuture', () => {
    let person = {'Years to Retirement': 10, 'Brokerage Investments': 100};

    it('should return a projection for the specified time period', () => {
      var result = FutureCalculator.projectFuture(person);
      
      expect(result.length).toEqual(11);
    });
  });
});
