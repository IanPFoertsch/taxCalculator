var FutureCalculator = Calculator.FutureCalculator;

describe('FutureCalculator', function() {
  describe('projectCashFlows', () => {
    let workingPeriod = 5;
    let retirementLength = 5;
    let rothContributions = 5000;
    let traditionalContributions = 5000;
    let brokerageContributions = 1000;
    let person = {
      'Years to Retirement': workingPeriod,
      'Retirement Length': retirementLength,
      [Constants.ROTH_IRA]: rothContributions,
      [Constants.TRADITIONAL_IRA]: traditionalContributions,
      [Constants.BROKERAGE]: brokerageContributions,
      'Gross Income': 50000
    };

    it('should return a projection for working period', () => {
      var projection = FutureCalculator.projectCashFlows(person);
      expect(projection.length).toEqual(workingPeriod);
    });

    it('should include the persons account contributions in the projection', () => {
      var projection = FutureCalculator.projectCashFlows(person);
      var finalYear = projection[projection.length - 1];
      expect(finalYear[Constants.ROTH_IRA]).toEqual(rothContributions);
      expect(finalYear[Constants.BROKERAGE]).toEqual(brokerageContributions);
      expect(finalYear[Constants.TRADITIONAL_IRA]).toEqual(traditionalContributions);
    });
  });

  describe('projectAccounts', () => {
    let person = {'Years to Retirement': 10, 'Roth IRA Contributions': 100};
    it('should return a projection for the specified time period', () => {
      var result = FutureCalculator.projectAccounts(person);
      expect(result[Constants.ROTH_IRA].length).toEqual(11);
    });

    it('should have a field for each type of account', () => {
      var result = FutureCalculator.projectAccounts(person);
      var expectedKeys = [Constants.ROTH_IRA, Constants.TRADITIONAL_IRA];
      _.each(expectedKeys, (expected) => {
        expect(result[expected]).not.toBeUndefined();
      });
    });

    describe('with a specified retirement period', () => {
      let person = {
        'Years to Retirement': 5,
        [Constants.ROTH_IRA]: 100,
        'Retirement Length': 5,
        'Retirement Spending': 100
      };

      it('it should calculate for the sum of the working and retirement periods', () => {
        var result = FutureCalculator.projectAccounts(person);
        expect(result[Constants.ROTH_IRA].length).toEqual(11);
      });

      it('it should append the time indexes of the working and retirement periods', () => {
        var result = FutureCalculator.projectAccounts(person);
        var roth = result['Roth IRA Account'];

        _.reduce(roth, (index, entry) => {
          expect(entry.x).toEqual(index);
          return entry.x + 1;
        }, 0);
      });
    });
  });
});
