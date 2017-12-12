var CashFlow = Models.CashFlow

function Account(label) {
  this.label = label
  this.contributions = {}
  this.expenses = {}
  this.interestFlows = {}
}

Account.prototype.flows = function() {
  return [this.contributions, this.expenses, this.interestFlows]
}

Account.prototype.getValue = function(maxTime) {
  //TODO: if we create a table of values repeatedly using this maxTime
  //parameter, we're going to be repeating the same calculations many times
  //over - amend this to include memoization
  return _.reduce(this.timeIndices(maxTime), (value, index) =>  {
    var contributions = this.contributions[index]
    var expenses = this.expenses[index]
    var interestFlows = this.interestFlows[index]

    var contribution = this.sumFlow(contributions)
    var outValue = this.sumFlow(expenses)
    var interestValue = this.sumFlow(interestFlows)

    return value + (contribution - outValue) + interestValue
  }, 0)
}

//private
Account.prototype.registerContribution = function(cashFlow) {
  var time = cashFlow.time
  this.contributions[time] = this.contributions[time] || []
  this.contributions[time].push(cashFlow)
}

//private
Account.prototype.registerOutFlow = function(cashFlow) {
  var time = cashFlow.time
  this.expenses[time] = this.expenses[time] || []
  this.expenses[time].push(cashFlow)
}

Account.prototype.createContribution = function(timeIndex, value, fromAccount) {
  var flow = new CashFlow(timeIndex, value, this, fromAccount)
  this.registerContribution(flow)
  fromAccount.registerOutFlow(flow)
}

Account.prototype.createExpense = function(timeIndex, value, toAccount) {
  var flow = new CashFlow(timeIndex, value, toAccount, this)
  this.registerOutFlow(flow)
  toAccount.registerContribution(flow)
}

Account.prototype.createInterestFlow = function(timeIndex, value) {
  this.interestSource = this.interestSource || new Account('Interest')
  this.interestFlows[timeIndex] = this.interestFlows[timeIndex] || []
  this.interestFlows[timeIndex].push(new CashFlow(timeIndex, value, this, this.interestSource))
}

Account.prototype.timeIndices = function(maxTime) {
  var indices = _.reduce(this.flows(), (memo, flow) => {
    return memo.concat(Object.keys(flow))
  }, [])
  var sorted = Array.from(new Set(indices)).sort()
  if (maxTime != undefined) {
    return _.filter(sorted, (index) => {
      return parseInt(index) <= maxTime
    })
  } else {
    return sorted
  }
}

Account.prototype.sumFlow = function(flows) {
  return _.reduce(flows, (value, flow) => {
    return value + flow.getValue()
  }, 0) || 0
}

Account.prototype.calculateInterest = function(endTime) {
  //reset the state
  this.interestFlows = {}
  //TODO: this is "stateful"... which is bad, figure out a way to calculate
  //and track this statelessly

  _.forEach(_.range(0, endTime), (time) => {
    var interestGain = this.singlePeriodCompounding(time)
    this.createInterestFlow(time + 1, interestGain, this.interestSource)
  })
}

Account.prototype.singlePeriodCompounding = function(timeStep) {
  //get the value for the account at the previous time step
  //use the value calculator to calculate the interest on it
  var value = this.getValue(timeStep)
  return value * Constants.DEFAULT_GROWTH_RATE
}

Models.Account = Account
