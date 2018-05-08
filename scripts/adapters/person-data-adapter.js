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

var flowBalanceByTimeData = function(accounts, maxTime) {
  var data = _.reduce(accounts, (memo, account) => {
    memo[account.getLabel()] = _.map(_.range(0, maxTime + 1), (timeIndex) => {
      return account.getFlowBalanceAtTime(timeIndex)
    })

    return memo
  }, {})

  var labels = _.map(_.range(maxTime), (i) => {
    return 'Year ' + i
  })

  return { data: data, labels: labels}
}

PersonDataAdapter.lineChartData = lineChartData
PersonDataAdapter.flowBalanceByTimeData = flowBalanceByTimeData

Adapters.PersonDataAdapter = PersonDataAdapter
