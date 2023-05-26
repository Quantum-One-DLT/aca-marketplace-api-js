# MarketplaceApi.PlanSearchFilter

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**diseaseMgmtPrograms** | [**[DiseaseMgmtProgramsEnum]**](DiseaseMgmtProgramsEnum.md) |  | [optional] 
**division** | [**ProductDivisionEnum**](ProductDivisionEnum.md) |  | [optional] 
**issuer** | **String** | Issuer name | [optional] 
**issuers** | **[String]** | A List of Issuers names | [optional] 
**metalLevels** | [**[MetalLevelEnum]**](MetalLevelEnum.md) | A list of Metalic Levels | [optional] 
**metalLevel** | [**MetalLevelEnum**](MetalLevelEnum.md) |  | [optional] 
**metalDesignTypes** | [**[MetalDesignType]**](MetalDesignType.md) | A list of Plan Design Type / Metalic Level Combinations | [optional] 
**designTypes** | [**[DesignTypeEnum]**](DesignTypeEnum.md) | A list of Plan Design Types | [optional] 
**premium** | **Number** |  | [optional] 
**type** | [**PlanTypeEnum**](PlanTypeEnum.md) |  | [optional] 
**types** | [**[PlanTypeEnum]**](PlanTypeEnum.md) | a list of plan types | [optional] 
**deductible** | **Number** |  | [optional] 
**hsa** | **Boolean** | HSA eligibilty | [optional] 
**oopc** | **Number** | Out of Pocket Costs | [optional] 
**childDentalCoverage** | **Boolean** | Only show plans with child dental coverage | [optional] 
**adultDentalCoverage** | **Boolean** | Only show plans with adult dental coverage | [optional] 
**drugs** | **[String]** | A list of RXCUIs | [optional] 
**providers** | **[String]** | A list of NPIs | [optional] 
**qualityRating** | **Number** | Quality ratings for a plan | [optional] 
**simpleChoice** | **Boolean** |  | [optional] 
**premiumRange** | [**Range**](Range.md) |  | [optional] 
**deductibleRange** | [**Range**](Range.md) |  | [optional] 


