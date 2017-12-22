var Account = Models.Account

function NonAccumulatingAccount(label) {
  Account.call(this, label)
}

NonAccumulatingAccount.prototype.getValue = function() {
  //hardcode the value to 0
  return 0.0
}

NonAccumulatingAccount.prototype = Object.create(Account.prototype)

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
