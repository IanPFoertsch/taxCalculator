function CashFlow(time, value, source, target) {
  //we may end up tracking time externally
  this.time = time
  this.value = value
  this.source = source
  this.target = target
}

// CashFlow.protoype = Object.create();

CashFlow.prototype.getValue = function() {
  return this.value
}

Models.CashFlow = CashFlow
