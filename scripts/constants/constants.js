'use-strict'
var Constants = function() {}

Constants.ROTH_IRA = 'Roth IRA'
Constants.TRADITIONAL_IRA = 'Traditional IRA'
Constants.TRADITIONAL_401K = 'Traditional 401k'
Constants.ROTH_401K = 'Roth 401k'
Constants.BROKERAGE = 'Brokerage'

Constants.TRADITIONAL_IRA_CONTRIBUTIONS = 'Traditional IRA Contributions'
Constants.ROTH_IRA_CONTRIBUTIONS = 'Roth IRA Contributions'

Constants.TRADITIONAL_401K_CONTRIBUTIONS = 'Traditional 401k Contributions'
Constants.ROTH_401K_CONTRIBUTIONS = 'Roth 401k Contributions'

Constants.WAGES_AND_COMPENSATION = 'Wages and Compensation'
Constants.CAREER_LENGTH = 'Career Length'
Constants.RETIREMENT_LENGTH = 'Retirement Length'
Constants.EMPLOYER = 'Employer'

Constants.NET_INCOME = 'Net Income'
Constants.ADJUSTED_GROSS_INCOME = 'WAGES_AND_COMPENSATION'
Constants.MODIFIED_ADJUSTED_GROSS_INCOME = 'WAGES_AND_COMPENSATION'

Constants.TAXABLE_INCOME = 'Taxable Income'
Constants.POST_TAX_INCOME = 'Post Tax Income'
Constants.TOTAL_INCOME = 'Total Income'
Constants.FEDERAL_INCOME_TAX = 'Federal Income Tax'
Constants.MEDICARE = 'Medicare'
Constants.SOCIAL_SECURITY = 'Social Security'
Constants.PRE_TAX_BENEFITS = 'Pre Tax Benefits'
Constants.SOCIAL_SECURITY_WAGES = 'Social Security Wages'

//TODO: Assume for now that the user is not self-employed
Constants.MEDICARE_RATE = 0.0145
Constants.SOCIAL_SECURITY_RATE = 0.062
//TODO: update these values for 2018
Constants.SOCIAL_SECURITY_MAXIMUM = 118500

Constants.DEFAULT_GROWTH_RATE = 0.03
Constants.AGE = 'Age'
