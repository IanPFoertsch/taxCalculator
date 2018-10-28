var WithdrawalCalculator = Calculator.WithdrawalCalculator
var TaxCalculator = Calculator.TaxCalculator

describe('WithdrawalCalculator', function() {
  describe('traditionalWithdrawalsToGoal', () => {
    var taxExemptIncome = 20000
    var taxableIncome = 10000
    var incomeGoal = 50000

    it('withdraws income to meet the income goal and account for federal income tax', () => {
      var traditionalWithdrawals = WithdrawalCalculator.traditionalWithdrawalsToGoal(
        taxExemptIncome,
        taxableIncome,
        incomeGoal
      )
      var incomeTaxOwed = TaxCalculator.federalIncomeTax(traditionalWithdrawals + taxableIncome)

      expect(
        (traditionalWithdrawals + taxableIncome) -  incomeTaxOwed +
        taxExemptIncome
      ).toBeCloseTo(incomeGoal, 0.1)
    })
  })

  describe('withdrawalUpToStandardDeductionFromTraditional', () => {
    var taxableIncome, retirementSpending, traditionalBalance

    beforeEach(() => {
      retirementSpending = 50000
      traditionalBalance = 50000
    })

    describe('when the taxable income already exceeds the STANDARD_DEDUCTION', () => {
      beforeEach(()=> {
        taxableIncome = Constants.STANDARD_DEDUCTION + 1000
      })

      it('returns 0', () => {
        expect(WithdrawalCalculator.withdrawalUpToStandardDeductionFromTraditional(
          taxableIncome,
          retirementSpending,
          traditionalBalance
        )).toEqual(0)
      })
    })

    describe('when the taxableIncome does not already exceed the STANDARD_DEDUCTION', () => {
      beforeEach(()=> {
        taxableIncome = 1000
      })

      describe('when the spending goal exceeds the STANDARD_DEDUCTION', () => {

        it('withdraws traditional funds up to the STANDARD_DEDUCTION, accounting for existing taxable income', () => {
          expect(WithdrawalCalculator.withdrawalUpToStandardDeductionFromTraditional(
            taxableIncome,
            retirementSpending,
            traditionalBalance
          )).toEqual(Constants.STANDARD_DEDUCTION - taxableIncome)
        })

        describe('when there are insufficent traditional funds to meet the spending goal', () => {
          beforeEach(()=> {
            traditionalBalance = 5000
          })

          it('withdraws traditional funds up to the maximum available', () => {
            expect(WithdrawalCalculator.withdrawalUpToStandardDeductionFromTraditional(
              taxableIncome,
              retirementSpending,
              traditionalBalance
            )).toEqual(traditionalBalance)
          })
        })


        describe('when the spending goal does not exceed the STANDARD_DEDUCTION', () => {
          beforeEach(()=> {
            retirementSpending = 9000
          })

          describe('when there are insufficent traditional funds to meet the spending goal', () => {

            beforeEach(()=> {
              traditionalBalance = 5000
            })

            it('withdraws traditional funds up to the maximum available', () => {
              expect(WithdrawalCalculator.withdrawalUpToStandardDeductionFromTraditional(
                taxableIncome,
                retirementSpending,
                traditionalBalance
              )).toEqual(traditionalBalance)
            })
          })
        })
      })
    })
  })

  describe('proportionalWithdrawals', () => {
    //TODO: Add test coverage
  })
})
