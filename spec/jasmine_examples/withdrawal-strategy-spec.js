var WithdrawalStrategy = Calculator.WithdrawalStrategy;


describe('WithdrawalStrategy', function() {
  let taxExemptWithdrawals = Constants.STANDARD_DEDUCTION + Constants.PERSONAL_EXEMPTION;

  describe('with empty accounts', () => {
    let targetAmount = 10000;
    let rothAmount = 0;
    let traditionalAmount = 0;
    let accounts = {
      [Constants.ROTH_IRA]: [rothAmount],
      [Constants.TRADITIONAL_IRA]: [traditionalAmount]
    };

    it('should return withdrawals of 0', () => {
      expect(WithdrawalStrategy.withdrawToTarget(accounts, targetAmount)).toEqual({
        [Constants.ROTH_IRA]: rothAmount,
        [Constants.TRADITIONAL_IRA]: traditionalAmount
      });
    });
  });

  describe('with account totals above the amount to be withdrawn', () => {
    let accounts = {
      [Constants.ROTH_IRA]: [
        100000
      ],
      [Constants.TRADITIONAL_IRA]: [
        100000
      ]
    };

    describe('with a target amount below the standard deduction plus the personal exemption', () => {
      let targetAmount = 5000;
      it('should return the target amount withdrawn from the traditional ira account', () => {
        expect(WithdrawalStrategy.withdrawToTarget(accounts, targetAmount)).toEqual({
          [Constants.ROTH_IRA]: 0,
          [Constants.TRADITIONAL_IRA]: targetAmount
        });
      });
    });

    describe('with a target amount above the standard deduction plust the personal exemption', () => {
      let targetAmount = 13000;
      let expectedTraditional = taxExemptWithdrawals;
      let expectedRoth = targetAmount - taxExemptWithdrawals;
      it('should return up to the tax exempt limit from the traditional account and the remainder from roth', () => {
        expect(WithdrawalStrategy.withdrawToTarget(accounts, targetAmount)).toEqual({
          [Constants.ROTH_IRA]: expectedRoth,
          [Constants.TRADITIONAL_IRA]: expectedTraditional
        });
      });
    });
  });

  describe('with account totals less than the amount to be withdrawn', () => {
    let targetAmount = 15000;
    let rothAmount = 5000;
    let traditionalAmount = 9000;
    let accounts = {
      [Constants.ROTH_IRA]: [rothAmount],
      [Constants.TRADITIONAL_IRA]: [traditionalAmount]
    };

    it('should return the available funds for each account', () => {
      expect(WithdrawalStrategy.withdrawToTarget(accounts, targetAmount)).toEqual({
        [Constants.ROTH_IRA]: rothAmount,
        [Constants.TRADITIONAL_IRA]: traditionalAmount
      });
    });
  });

  describe('with traditional IRA withdraws more than the exemption but less than the desired withdrawals', () => {
    let targetAmount = 15000;
    let rothAmount = 0;
    let traditionalAmount = 14000;
    let accounts = {
      [Constants.ROTH_IRA]: [rothAmount],
      [Constants.TRADITIONAL_IRA]: [traditionalAmount]
    };

    it('should return all of the available traditional IRA funds', () => {
      expect(WithdrawalStrategy.withdrawToTarget(accounts, targetAmount)).toEqual({
        [Constants.ROTH_IRA]: rothAmount,
        [Constants.TRADITIONAL_IRA]: traditionalAmount
      });
    });
  });
});
