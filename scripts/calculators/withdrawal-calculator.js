'use-strict'
var TaxCalculator = Calculator.TaxCalculator
function WithdrawalCalculator() {}

WithdrawalCalculator.traditionalWithdrawalsToGoal = function(
  taxExemptIncome,
  taxableIncome,
  incomeGoal
) {
  //calculate the current taxes
  var currentTaxes = currentTaxes = TaxCalculator.federalIncomeTax(taxableIncome)
  var delta = 0
  var additionalTraditionalWithdrawals = 0
  var currentNetIncome = taxExemptIncome + taxableIncome - currentTaxes

  while (currentNetIncome < incomeGoal - .1) {
    delta = incomeGoal - currentNetIncome
    additionalTraditionalWithdrawals = (additionalTraditionalWithdrawals) + delta * .9
    currentTaxes = TaxCalculator.federalIncomeTax(taxableIncome + additionalTraditionalWithdrawals)
    currentNetIncome = (taxExemptIncome + taxableIncome + additionalTraditionalWithdrawals) - currentTaxes
  }
  return additionalTraditionalWithdrawals
}

WithdrawalCalculator.proportionalWithdrawals = function(balance, withdrawals, incomeToFill, remainingFunds) {
  var updatedWithdrawals = withdrawals
  var proportion = (balance - withdrawals) / remainingFunds
  if ((balance - withdrawals) > 0) {
    var additionalWithdrawals = incomeToFill * proportion

    if (additionalWithdrawals > (balance - withdrawals)) {
      additionalWithdrawals = (balance - withdrawals)
    }

    updatedWithdrawals = withdrawals + additionalWithdrawals
  }

  return updatedWithdrawals
}


WithdrawalCalculator.withdrawalUpToStandardDeductionFromTraditional = function(
  taxableIncome,
  retirementSpending,
  traditionalBalance
) {
  var traditionalWithdrawals = 0
  var spendingGap = Constants.STANDARD_DEDUCTION - taxableIncome

  if(taxableIncome >= Constants.STANDARD_DEDUCTION) {
    return traditionalWithdrawals
  }

  if (retirementSpending > Constants.STANDARD_DEDUCTION) {
    if (traditionalBalance > spendingGap) {
      //we have enough to meet the gap from traditional funds alone
      traditionalWithdrawals = spendingGap
    } else {
      traditionalWithdrawals = traditionalBalance
    }
  }
  else { //retirementSpending < STANDARD_DEDUCTION
    if (traditionalBalance > retirementSpending) {
      traditionalWithdrawals = retirementSpending
    } else { // we don't have enough money to fill spending from trad funds alone
      traditionalWithdrawals =  traditionalBalance
    }
  }

  return traditionalWithdrawals
}

Calculator.WithdrawalCalculator = WithdrawalCalculator
