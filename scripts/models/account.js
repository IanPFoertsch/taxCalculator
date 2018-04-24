var CashFlow = Models.CashFlow
//Abstract SuperClass
function Account(label) {
  this.label = label
  this.contributions = {}
  this.expenses = {}
}

Account.prototype.getLabel = function() {
  return this.label
}

Account.prototype.flows = function() {
  return this.getPositiveFlowList().concat(this.getNegativeFlowList())
}

Account.prototype.getFlowBalanceAtTime = function(time) {
  var positiveValue = _.reduce(this.getPositiveFlowList(), (value, flowList) => {
    return value + this.sumFlow(flowList[time])
  }, 0)

  var negativeValue = _.reduce(this.getNegativeFlowList(), (value, flowList) => {
    return this.sumFlow(flowList[time])
  }, 0)

  return positiveValue - negativeValue
}

Account.prototype.getPositiveFlowList = function() {
  return [this.contributions]
}

Account.prototype.getNegativeFlowList = function() {
  return [this.expenses]
}

Account.prototype.getInFlowValueAtTime = function(time) {
  var flows = this.contributions[time]

  return _.reduce(flows, (memo, flow) => {
    return memo + flow.getValue()
  }, 0) || 0
}

//private
Account.prototype.registerInFlow = function(cashFlow) {
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

Account.prototype.createInFlow = function(timeIndex, value, fromAccount) {

  var flow = new CashFlow(timeIndex, value, fromAccount, this)
  this.registerInFlow(flow)
  fromAccount.registerOutFlow(flow)
}

Account.prototype.createExpense = function(timeIndex, value, toAccount) {
  var flow = new CashFlow(timeIndex, value, toAccount, this)
  this.registerOutFlow(flow)
  toAccount.registerInFlow(flow)
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

  indices = _.map(indices, (index) => {
    return parseInt(index)
  })

  var sorted = Array.from(new Set(indices)).sort(( function(a,b) { return a - b } ))
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
  var value = this.getValueAtTime(timeStep)
  return value * Constants.DEFAULT_GROWTH_RATE
}

Models.Account = Account
