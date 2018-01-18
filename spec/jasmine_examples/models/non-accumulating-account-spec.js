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
})
