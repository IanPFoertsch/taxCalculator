var CashFlow = Models.CashFlow

function Account(label) {
  this.label = label
  this.contributions = {}
  this.outflows = {}
  this.interestFlows = {}
}

Account.prototype.flows = function() {
  return [this.contributions, this.outflows, this.interestFlows]
}

Account.prototype.getValue = function() {
  return _.reduce(this.timeIndices(), (value, index) =>  {
    var contributions = this.contributions[index]
    var outflows = this.outflows[index]
    var interestFlows = this.interestFlows[index]

    var contribution = this.sumFlow(contributions)
    var outValue = this.sumFlow(outflows)
    var interestValue = this.sumFlow(interestFlows)

    return value + (contribution - outValue) + interestValue
  }, 0)
}

Account.prototype.createContribution = function(timeIndex, value, fromAccount) {
  this.contributions[timeIndex] = this.contributions[timeIndex] || []
  this.contributions[timeIndex].push(new CashFlow(timeIndex, value, this, fromAccount))
}

Account.prototype.createOutflow = function(timeIndex, value, toAccount) {
  this.outflows[timeIndex] = this.outflows[timeIndex] || []
  this.outflows[timeIndex].push(new CashFlow(timeIndex, value, toAccount, this))
}

Account.prototype.createInterestFlow = function(timeIndex, value) {
  this.interestSource = this.interestSource || new Account('Interest')
  this.interestFlows[timeIndex] = this.interestFlows[timeIndex] || []
  this.interestFlows[timeIndex].push(new CashFlow(timeIndex, value, this, this.interestSource))
}

Account.prototype.timeIndices = function() {
  var indices = _.reduce(this.flows(), (memo, flow) => {
    return memo.concat(Object.keys(flow))
  }, [])
  return Array.from(new Set(indices)).sort()
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
