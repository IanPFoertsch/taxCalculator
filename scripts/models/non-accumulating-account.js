var Account = Models.Account

function NonAccumulatingAccount(label) {
  Account.call(this, label)
}

NonAccumulatingAccount.prototype = Object.create(Account.prototype)

NonAccumulatingAccount.prototype.getValueAtTime = function(time) {
  return this.getFlowBalanceAtTime(time)
}

function TaxCategory(label) {
  Account.call(this, label)
}

TaxCategory.prototype = Object.create(NonAccumulatingAccount.prototype)


function Expense(label) {
  Account.call(this, label)
}

Expense.prototype = Object.create(NonAccumulatingAccount.prototype)


Models.TaxCategory = TaxCategory
Models.Expense = Expense
Models.NonAccumulatingAccount = NonAccumulatingAccount
