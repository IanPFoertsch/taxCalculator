var NonAccumulatingAccount = Models.NonAccumulatingAccount
var Account = Models.Account


describe('NonAccumulatingAccount', function() {
  var nonAccumulatingAccount
  var employer

  beforeEach(() => {
    nonAccumulatingAccount = new NonAccumulatingAccount(Constants.WAGES_AND_COMPENSATION)
    employer = new Account(Constants.EMPLOYER)
  })

  describe('getValue', () => {
    beforeEach(() => {
      nonAccumulatingAccount.createInFlow(0, 100, employer)
    })

    it('should default to zero', () => {
      expect(nonAccumulatingAccount.getValue()).toEqual(0)
    })
  })

  describe('getInflowValueAtTime', () => {
    var inValue = 100
    var time = 0
    var repetitions = [0,1,2]

    it('calculates the value of the inflows for a given time', () => {
      nonAccumulatingAccount.createInFlow(time, inValue, employer)
      expect(nonAccumulatingAccount.getInFlowValueAtTime(time)).toEqual(inValue)
    })

    describe('with multiple inflows at the requested time', () => {
      fit('calculates the value of all of the inflows for a given time', () => {
        _.forEach(repetitions, () => {
          nonAccumulatingAccount.createInFlow(time, inValue, employer)
        })

        expect(nonAccumulatingAccount.getInFlowValueAtTime(time)).toEqual(inValue * repetitions.length)
      })
    })

    describe('with inflows in different time periods', () => {
      fit('calculates the value the inflows only for the queried time', () => {
        _.forEach(repetitions, (repetition) => {
          nonAccumulatingAccount.createInFlow(repetition, inValue, employer)
        })
        nonAccumulatingAccount.createInFlow(time, inValue, employer)

        expect(nonAccumulatingAccount.getInFlowValueAtTime(time)).toEqual(inValue * 2)
      })
    })
  })
})
