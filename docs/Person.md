# MarketplaceApi.Person

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**age** | **Number** | required if dob not provided | 
**dob** | **String** | A person's date of birth (YYYY-MM-DD) required if age not provided | 
**hasMec** | **Boolean** | has minimum essential coverage | [optional] 
**isParent** | **Boolean** |  | [optional] 
**isPregnant** | **Boolean** | Indicates whether the individual is pregnant or not. If this is true and `pregnant_with` is not provided, `pregnant_with` is assumed to be 1. | [optional] 
**pregnantWith** | **Number** | The number of expected children from a pregnancy. If this value is > 0, `is_pregnant` is assumed to be true, even if specified otherwise. | [optional] 
**usesTobacco** | **Boolean** |  | [optional] 
**lastTobaccoUseDate** | **String** | The last date of regular tobacco use (YYYY-MM-DD) | [optional] 
**gender** | [**GenderEnum**](GenderEnum.md) |  | [optional] 
**utilizationLevel** | [**UtilizationEnum**](UtilizationEnum.md) |  | [optional] 
**relationship** | [**Relationship**](Relationship.md) |  | [optional] 
**doesNotCohabitate** | **Boolean** |  | [optional] 
**aptcEligible** | **Boolean** | is the given person eligible for APTC | [optional] 
**currentEnrollment** | [**CurrentEnrollment**](CurrentEnrollment.md) |  | [optional] 


