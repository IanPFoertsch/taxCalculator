var FutureCalculator = Calculator.FutureCalculator;

describe('FutureCalculator', function() {
  describe('projectFuture', () => {
    let person = {'Years to Retirement': 10, 'Roth IRA Contributions': 100};

    it('should return a projection for the specified time period', () => {
      var result = FutureCalculator.projectFuture(person);
      expect(result['Roth IRA Account'].length).toEqual(11);
    });

    it('should have a field for each type of account', () => {
      var result = FutureCalculator.projectFuture(person);
      var expectedKeys = ['Roth IRA Account', 'Traditional IRA Account'];
      _.each(expectedKeys, (expected) => {
        expect(result[expected]).not.toBeUndefined();
      });
    });

    describe('with a specified retirement period', () => {
      let person = {
        'Years to Retirement': 20,
        'Roth IRA Contributions': 100,
        'Retirement Length': 10,
        'Retirement Spending': 100
      };

      it('it should calculate for the sum of the working and retirement periods', () => {
        var result = FutureCalculator.projectFuture(person);
        expect(result['Roth IRA Account'].length).toEqual(31);
      });

      it('it should append the time indexes of the working and retirement periods', () => {
        var result = FutureCalculator.projectFuture(person);
        var roth = result['Roth IRA Account'];

        _.reduce(roth, (index, entry) => {
          expect(entry.x).toEqual(index);
          return entry.x + 1;
        }, 0);
      });
    });
  });
});
