describe('PersonDataAdapter', function() {
  var PersonDataAdapter = Adapters.PersonDataAdapter
  var AccountDataAdapter = Adapters.AccountDataAdapter
  var Account = Models.Account

  let firstLabel
  let lastLabel
  let maxTime
  let firstAccount
  let lastAccount
  let accounts

  beforeEach(() => {
    firstAccount = new Account()
    lastAccount = new Account()
    firstLabel = 'the label'
    lastLabel = 'the other label'
    maxTime = 2
    accounts = [firstAccount, lastAccount]
  })

  describe('lineChartData', () => {
    beforeEach(() => {
      spyOn(AccountDataAdapter, 'accountValueData')
      spyOn(firstAccount, 'getLabel').and.returnValue(firstLabel)
      spyOn(lastAccount, 'getLabel').and.returnValue(lastLabel)
    })

    it('gets the label from each account', () => {
      PersonDataAdapter.lineChartData(accounts, maxTime)
      expect(firstAccount.getLabel).toHaveBeenCalledWith()
      expect(lastAccount.getLabel).toHaveBeenCalledWith()
    })

    it('queries the AccountDataAdapter for the account value data', () => {
      PersonDataAdapter.lineChartData(accounts, maxTime)
      _.forEach(accounts, (account) => {
        expect(AccountDataAdapter.accountValueData).toHaveBeenCalledWith(account, maxTime)
      })
    })
  })
})
