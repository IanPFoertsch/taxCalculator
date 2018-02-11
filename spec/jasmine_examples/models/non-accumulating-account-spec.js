var NonAccumulatingAccount = Models.NonAccumulatingAccount
var Account = Models.Account

describe('NonAccumulatingAccount', function() {
  var nonAccumulatingAccount
  var employer
  var time0 = 0
  var value = 100

  beforeEach(() => {
    nonAccumulatingAccount = new NonAccumulatingAccount(Constants.WAGES_AND_COMPENSATION)
    employer = new Account(Constants.EMPLOYER)
  })

  describe('getValue', () => {
    beforeEach(() => {
      nonAccumulatingAccount.createInFlow(time0, value, employer)
      nonAccumulatingAccount.createInFlow(time0 + 1, value, employer)
    })

    it('should default to zero', () => {
      expect(nonAccumulatingAccount.getValueAtTime(time0 + 1)).toEqual(value)
    })
  })
})
