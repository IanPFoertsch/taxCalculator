var AccountDataAdapter = Adapters.AccountDataAdapter
var Person = Models.Person
var AccumulatingAccount = Models.AccumulatingAccount

describe('AccountDataAdapter', function() {
  let account
  let maxTime = 3

  beforeEach(() => {
    account = new AccumulatingAccount()
  })

  describe('accountValueData', () => {
    beforeEach(() => {
      spyOn(account, 'getValueAtTime').and.callFake((arg) => {return (arg + 100) * 10})
    })


    it('queries the account for the value at particular time', () => {
      AccountDataAdapter.accountValueData(account, maxTime)
      _.forEach(_.range(0, maxTime + 1), (time) => {
        expect(account.getValueAtTime).toHaveBeenCalledWith(time)
      })
    })

    it('returns the correctly formatted data from the account, indexed by time', () => {
      var data = AccountDataAdapter.accountValueData(account, maxTime)
      expect(data).toEqual([
        { x: 0, y: 1000 },
        { x: 1, y: 1010 },
        { x: 2, y: 1020 },
        { x: 3, y: 1030 }
      ])
    })
  })
})
