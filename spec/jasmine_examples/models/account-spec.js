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

  describe('double entry BookKeeping', () => {
    describe('contributions', () => {
      it('registers the expense on the source account', () => {
        account.createInFlow(time0, invalue, source)
        expect(source.getValue()).toEqual( - invalue)
      })
    })

    describe('expenses', () => {
      it('when creating an expense, it registers the inflow on the target account', () => {
        account.createExpense(time0, invalue, source)
        expect(source.getValue()).toEqual(invalue)
      })
    })
  })

  describe('timeIndices', () => {
    var creationIndexes = [0, 1, 2, 3, 4, 5]
    var maxTime = 4
    beforeEach(() => {
      _.forEach(creationIndexes, (index) => {
        account.createInFlow(index, invalue, source)
      })
    })

    it('returns an array of indices not larger than the specified parameter', () => {
      var timeIndices = account.timeIndices(maxTime)
      expect(parseInt(timeIndices[timeIndices.length - 1])).toEqual(maxTime)
    })

    it('returns an array of all time indices if not given a query parameter', () => {
      var timeIndices = account.timeIndices()
      expect(parseInt(timeIndices[timeIndices.length - 1]))
        .toEqual(creationIndexes[creationIndexes.length -1])
    })
  })

  describe('getValue', () => {
    describe('when given a time query parameter', () => {
      var creationIndexes = [0, 1, 2, 3, 4, 5]
      var maxTime = 4
      beforeEach(() => {
        _.forEach(creationIndexes, (index) => {
          account.createInFlow(index, invalue, source)
        })
      })

      it('should calculate the value to the queryParameter', () => {
        expect(account.getValue(maxTime)).toEqual(invalue * 5)
      })
    })

    describe('with cashflows inward', () => {
      beforeEach(() => {
        account.createInFlow(time0, invalue, source)
      })

      it('should return the value of the inflow', () => {
        expect(account.getValue()).toEqual(invalue)
      })

      describe('with cashflows outward', () => {
        beforeEach(() => {
          account.createExpense(time0, outvalue, source)
        })

        it('should return the value of the inflow plus the expense', () => {
          expect(account.getValue()).toEqual(invalue - outvalue)
        })

        describe('with an interest flow', () => {
          var interestValue = 10
          beforeEach(() => {
            account.createInterestFlow(0, interestValue)
          })

          it('should return the value of the inflow, expense and interest flow', () => {
            expect(account.getValue()).toEqual(invalue - outvalue + interestValue)
          })
        })

        describe('for multiple years', () => {
          var otherOutValue = 25
          beforeEach(() => {
            account.createInFlow(time1, invalue, source)
            account.createExpense(time0, otherOutValue, source)
          })

          it('should sum the inflows and expenses over multiple years', () => {
            expect(account.getValue()).toEqual((invalue * 2) - (outvalue + otherOutValue))
          })
        })
      })
    })
  })

  describe('calculateInterest', () => {
    beforeEach(() => {
      account.createInFlow(0, invalue, source)
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

  describe('getInflowValueAtTime', () => {
    var inValue = 100
    var time = 0
    var repetitions = [0,1,2]

    it('calculates the value of the inflows for a given time', () => {
      account.createInFlow(time, inValue, source)
      expect(account.getInFlowValueAtTime(time)).toEqual(inValue)
    })

    describe('with multiple inflows at the requested time', () => {
      it('calculates the value of all of the inflows for a given time', () => {
        _.forEach(repetitions, () => {
          account.createInFlow(time, inValue, source)
        })

        expect(account.getInFlowValueAtTime(time)).toEqual(inValue * repetitions.length)
      })
    })

    describe('with inflows in different time periods', () => {
      it('calculates the value the inflows only for the queried time', () => {
        _.forEach(repetitions, (repetition) => {
          account.createInFlow(repetition, inValue, source)
        })
        account.createInFlow(time, inValue, source)

        expect(account.getInFlowValueAtTime(time)).toEqual(inValue * 2)
      })
    })
  })
})
