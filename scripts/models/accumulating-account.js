var Account = Models.Account

function AccumulatingAccount(label) {
  Account.call(this, label)
  this.interestFlows = {}
}

AccumulatingAccount.prototype = Object.create(Account.prototype)

AccumulatingAccount.prototype.getValueAtTime = function(time) {
  return _.reduce(this.timeIndices(time), (value, index) =>  {
    return value + this.getFlowBalanceAtTime(index)
  }, 0)
}

AccumulatingAccount.prototype.getPositiveFlowList = function() {
  return [this.contributions, this.interestFlows]
}

Models.AccumulatingAccount = AccumulatingAccount
