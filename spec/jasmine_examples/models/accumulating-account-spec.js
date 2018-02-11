var AccumulatingAccount = Models.AccumulatingAccount
var NonAccumulatingAccount = Models.NonAccumulatingAccount

describe('AccumulatingAccount', function() {
  var accumulatingAccount
  var employer

  var invalue = 100
  var outvalue = 50

  var time0 = 0
  var time1 = 1

  beforeEach(() => {
    accumulatingAccount = new AccumulatingAccount(Constants.ROTH_IRA)
    employer = new NonAccumulatingAccount(Constants.WAGES_AND_COMPENSATION)
  })

  describe('getValueAtTime', () => {
    describe('when given a time query parameter', () => {
      var creationIndexes = [0, 1, 2, 3, 4, 5]
      var maxTime = 4
      beforeEach(() => {
        _.forEach(creationIndexes, (index) => {
          accumulatingAccount.createInFlow(index, invalue, employer)
        })
      })

      it('should calculate the value to the queryParameter', () => {
        expect(accumulatingAccount.getValueAtTime(maxTime)).toEqual(invalue * 5)
      })
    })

    describe('with cashflows inward', () => {
      beforeEach(() => {
        accumulatingAccount.createInFlow(time0, invalue, employer)
      })

      it('should return the value of the inflow', () => {
        expect(accumulatingAccount.getValueAtTime()).toEqual(invalue)
      })

      describe('with cashflows outward', () => {
        beforeEach(() => {
          accumulatingAccount.createExpense(time0, outvalue, employer)
        })

        it('should return the value of the inflow plus the expense', () => {
          expect(accumulatingAccount.getValueAtTime()).toEqual(invalue - outvalue)
        })

        describe('with an interest flow', () => {
          var interestValue = 10
          beforeEach(() => {
            accumulatingAccount.createInterestFlow(0, interestValue)
          })

          it('should return the value of the inflow, expense and interest flow', () => {
            expect(accumulatingAccount.getValueAtTime()).toEqual(invalue - outvalue + interestValue)
          })
        })

        describe('for multiple years', () => {
          var otherOutValue = 25
          beforeEach(() => {
            accumulatingAccount.createInFlow(time1, invalue, employer)
            accumulatingAccount.createExpense(time0, otherOutValue, employer)
          })

          it('should sum the inflows and expenses over multiple years', () => {
            expect(accumulatingAccount.getValueAtTime()).toEqual((invalue * 2) - (outvalue + otherOutValue))
          })
        })
      })
    })
  })

  describe('calculateInterest', () => {
    beforeEach(() => {
      accumulatingAccount.createInFlow(0, invalue, employer)
    })

    it('calculates interest', () => {
      accumulatingAccount.calculateInterest(1)
      expect(accumulatingAccount.getFlowBalanceAtTime(1)).toEqual(invalue * Constants.DEFAULT_GROWTH_RATE)
    })

    it('calculates interest on the interest', () => {
      var firstYearInterest = invalue * Constants.DEFAULT_GROWTH_RATE
      var yearOneValue = invalue + firstYearInterest
      var yearTwoValue = invalue + firstYearInterest + (yearOneValue * Constants.DEFAULT_GROWTH_RATE)
      var secondYearInterest = yearTwoValue - (yearOneValue)

      accumulatingAccount.calculateInterest(2)
      expect(accumulatingAccount.getFlowBalanceAtTime(2)).toBeCloseTo(secondYearInterest, 3)
    })

    it('iterates to the specified year', () => {
      accumulatingAccount.calculateInterest(10)
    })

    it('should be idempotent', () => {
      accumulatingAccount.calculateInterest(10)
      var originalValue = accumulatingAccount.getFlowBalanceAtTime()

      accumulatingAccount.calculateInterest(10)
      expect(accumulatingAccount.getFlowBalanceAtTime()).toEqual(originalValue)
    })
  })
})
