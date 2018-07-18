'use-strict'
var Constants = function() {}

Constants.ROTH_IRA = 'Roth IRA'
Constants.TRADITIONAL_IRA = 'Traditional IRA'
Constants.BROKERAGE = 'Brokerage'

Constants.TRADITIONAL_CONTRIBUTIONS = 'Traditional Contributions'
Constants.ROTH_CONTRIBUTIONS = 'Roth Contributions'

Constants.WAGES_AND_COMPENSATION = 'Wages and Compensation'
Constants.CAREER_LENGTH = 'Career Length'
Constants.EMPLOYER = 'Employer'

Constants.NET_INCOME = 'Net Income'
Constants.ADJUSTED_GROSS_INCOME = 'WAGES_AND_COMPENSATION'
Constants.MODIFIED_ADJUSTED_GROSS_INCOME = 'WAGES_AND_COMPENSATION'

Constants.POST_TAX_INCOME = 'Post Tax Income'
Constants.FEDERAL_INCOME_TAX = 'Federal Income Tax'
Constants.MEDICARE = 'Medicare'
Constants.SOCIAL_SECURITY = 'Social Security'

//TODO: Assume for now that the user is not self-employed
Constants.MEDICARE_RATE = 0.0145
Constants.SOCIAL_SECURITY_RATE = 0.062
//TODO: update these values for 2018
Constants.SOCIAL_SECURITY_MAXIMUM = 118500

Constants.DEFAULT_GROWTH_RATE = 0.03
Constants.AGE = 'Age'
