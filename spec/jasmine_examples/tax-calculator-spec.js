var TaxCalculator = Calculator.TaxCalculator;

describe('TaxCalculator', function() {
  describe('calculateTaxes', function() {
    it('should apply a single tax bracket', function() {
      expect(TaxCalculator.federalIncomeTax(9275)).toEqual(9275 * 0.10);
    });

    it('apply multiple tax brackets', function() {
      expect(TaxCalculator.federalIncomeTax(37650)).toEqual(5183.75);
    });

    it('applying all but the last two tax brackets', function() {
      expect(TaxCalculator.federalIncomeTax(200000)).toEqual(49529.25);
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

    describe('without additional deductions', () => {
      let deductions = 0;
      it('should subtract the applicable deductions for a single person', function() {
        expect(TaxCalculator.lessDeductions(grossIncome, deductions)).toEqual(50000 - 10400);
      });
    });

    describe('with additional deductions', () => {
      let deductions = 1000;
      it('should add the specified deduction to the deductions for a single person', function() {
        expect(TaxCalculator.lessDeductions(grossIncome, deductions)).toEqual(50000 - (10400 + deductions));
      });
    });
  });
});
