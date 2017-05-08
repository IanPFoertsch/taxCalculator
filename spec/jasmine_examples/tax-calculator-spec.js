var TaxCalculator = Calculator.TaxCalculator;

describe('TaxCalculator', function() {
  describe('calculateTaxes', function() {
    var deductions = 10400;
    it('should apply a single tax bracket', function() {
      expect(TaxCalculator.federalIncomeTax(9275 + deductions)).toEqual(9275 * 0.10);
    });

    it('apply multiple tax brackets', function() {
      expect(TaxCalculator.federalIncomeTax(37650 + deductions)).toEqual(5183.75);
    });

    it('applying all but the last two tax brackets', function() {
      expect(TaxCalculator.federalIncomeTax(200000 + deductions)).toEqual(49529.25);
    });
  });

  describe('socialSecurityWithholding', function() {
    it('should apply the correct rate to the gross income', function() {
      expect(TaxCalculator.socialSecurityWithholding(100000)).toEqual(6200);
    });

    describe('with an income above the max ssn taxable level', function() {
      it('should return the maximum withholding', function() {
        expect(TaxCalculator.socialSecurityWithholding(150000)).toEqual(118500 * 0.062);
      });
    });
  });

  describe('medicareWithHolding', function() {
    it('should calculate the correct rate', function() {
      expect(TaxCalculator.medicareWithholding(100000)).toEqual(100000 * 0.0145);
    });
  });

  describe('less applicable deductions', function() {
    var grossIncome = 50000;
    it('should subtract the applicable deductions for a single person', function() {
      //TODO: this is dumb. create more meaningful unit tests.
      expect(TaxCalculator.lessDeductions(grossIncome)).toEqual(50000 - 10400);
    });
  });

  // describe('net income', function() {
  //   var grossIncome = 50000;
  //   it('should calculate net income after witholdings, deductions and income taxes', function() {
  //     expect(TaxCalculator.netIncome(grossIncome)).toEqual(
  //       TaxCalculator.medicareWithholding
  //     );
  //   });
  // });
});
