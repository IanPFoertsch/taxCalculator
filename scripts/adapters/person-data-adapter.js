var AccountDataAdapter = Adapters.AccountDataAdapter

//the data adapter is a tree crawler that outputs chart-formatted data
//to the chartjsAdapter
function PersonDataAdapter() {}

var lineChartData = function(accounts, maxTime) {
  return _.reduce(accounts, (memo, account) => {
    memo[account.getLabel()] = AccountDataAdapter.accountValueData(account, maxTime)
    return memo
  }, {})
}

PersonDataAdapter.lineChartData = lineChartData

Adapters.PersonDataAdapter = PersonDataAdapter
