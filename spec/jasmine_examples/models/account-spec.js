var Account = Models.Account

describe('Account', function() {
  var account
  var source

  var invalue = 100
  var outvalue = 50

  var time0 = 0
  var time1 = 1

  beforeEach(() => {
    account = new Account('Roth Ira')
    source = new Account('BookKeeping')
  })

  describe('getValue', () => {
    describe('with cashflows inward', () => {
      beforeEach(() => {
        account.createContribution(time0, invalue, source)
      })

      it('should return the value of the inflow', () => {
        expect(account.getValue()).toEqual(invalue)
      })

      describe('with cashflows outward', () => {
        beforeEach(() => {
          account.createOutflow(time0, outvalue, source)
        })

        it('should return the value of the inflow plus the outflow', () => {
          expect(account.getValue()).toEqual(invalue - outvalue)
        })

        describe('with an interest flow', () => {
          var interestValue = 10
          beforeEach(() => {
            account.createInterestFlow(0, interestValue)
          })

          it('should return the value of the inflow, outflow and interest flow', () => {
            expect(account.getValue()).toEqual(invalue - outvalue + interestValue)
          })
        })

        describe ('for multiple years', () => {
          var otherOutValue = 25
          beforeEach(() => {
            account.createContribution(time1, invalue, source)
            account.createOutflow(time0, otherOutValue, source)
          })

          it('should sum the inflows and outflows over multiple years', () => {
            expect(account.getValue()).toEqual((invalue * 2) - (outvalue + otherOutValue))
          })
        })
      })
    })
  })

  describe('calculateInterest', () => {
    beforeEach(() => {
      account.createContribution(0, invalue, source)
    })

    it('calculates interest', () => {
      account.calculateInterest(1)
      expect(account.getValue()).toEqual(invalue + (invalue * Constants.DEFAULT_GROWTH_RATE))
    })

    it('calculates interest on the interest', () => {
      var yearOneValue = invalue + (invalue * Constants.DEFAULT_GROWTH_RATE)
      var secondYearValue = yearOneValue + (yearOneValue * Constants.DEFAULT_GROWTH_RATE)
      account.calculateInterest(2)
      expect(account.getValue()).toEqual(secondYearValue)
    })

    it('iterates to the specified year', () => {
      account.calculateInterest(10)
    })

    it('should be idempotent', () => {
      account.calculateInterest(10)
      var originalValue = account.getValue()

      account.calculateInterest(10)
      expect(account.getValue()).toEqual(originalValue)
    })
  })
})
