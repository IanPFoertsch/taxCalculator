'use-strict';
function WithdrawalStrategy() {}

WithdrawalStrategy.withdrawToTarget = function(accounts, targetAmount) {
  var traditionalWithdrawals = this.traditionalUpToExemptAmount(accounts, targetAmount);
  var rothWithdrawals = this.rothRemainder(accounts, targetAmount, traditionalWithdrawals);

  traditionalWithdrawals = traditionalWithdrawals + this.traditionalRemainder(accounts, targetAmount, traditionalWithdrawals);

  return {
    [Constants.ROTH_IRA]: rothWithdrawals,
    [Constants.TRADITIONAL_IRA]: traditionalWithdrawals
  };
};

WithdrawalStrategy.traditionalRemainder = function(accounts, targetAmount, traditionalWithdrawals) {
  // Because we are now paying taxes on our withdrawals, we have to account
  // for the taxes we are now paying. Because taxes are a one-way function,
  // (or maybe because I don't know math), we'll do this using a binary search method.
  

}

WithdrawalStrategy.traditionalUpToExemptAmount = function(accounts, targetAmount) {
  var threshold = Constants.STANDARD_DEDUCTION + Constants.PERSONAL_EXEMPTION;
  var availableTraditional = this.availableBalance(Constants.TRADITIONAL_IRA, accounts);
  var traditionalWithdrawals = 0;
  if (targetAmount < threshold) {
    // If we're trying to withdraw _less_ than the tax exempt amount,
    // only withdraw that smaller amount
    traditionalWithdrawals = targetAmount;
  } else { //Otherwise withdraw the tax exempt amount
    traditionalWithdrawals = threshold;
  }
  //Reduce to only withdraw available funds if insufficent funds
  if (traditionalWithdrawals > availableTraditional) {
    traditionalWithdrawals = availableTraditional;
  }

  return traditionalWithdrawals;
};

WithdrawalStrategy.rothRemainder = function(accounts, targetSpending, traditionalWithdrawals) {
  var rothWithdrawals = targetSpending - traditionalWithdrawals;
  var availableRoth = this.availableBalance(Constants.ROTH_IRA, accounts);

  //Reduce to only withdraw available funds if insufficent funds
  if (rothWithdrawals > availableRoth) {
    rothWithdrawals = availableRoth;
  }

  return rothWithdrawals;
};


WithdrawalStrategy.availableBalance = function(accountType, accounts) {
  var account  = accounts[accountType];
  return account[account.length - 1];
};


WithdrawalStrategy.insufficentFunds = function(withdrawal, availableFunds) {
  return withdrawal > availableFunds;
};


Calculator.WithdrawalStrategy = WithdrawalStrategy;
