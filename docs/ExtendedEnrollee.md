# MarketplaceApi.ExtendedEnrollee

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **String** | The enrollee's id (uuid) | [optional] 
**name** | **String** | The enrollee's name | [optional] 
**gender** | [**GenderEnum**](GenderEnum.md) |  | [optional] 
**dob** | **String** | The enrollee's date of birth (iso8601 date) | [optional] 
**location** | [**Address**](Address.md) |  | [optional] 
**csr** | [**CostSharingReductionEnum**](CostSharingReductionEnum.md) |  | [optional] 
**isFiler** | **Boolean** |  | [optional] 
**effectiveAge** | **Number** | Effective age of the enrollee at time of enrollment. | [optional] 
**hasHardship** | **Boolean** |  | [optional] 
**relationship** | [**Relationship**](Relationship.md) |  | [optional] 
**allowedMetalLevels** | [**[MetalLevelEnum]**](MetalLevelEnum.md) |  | [optional] 
**allowedPlanIds** | [**[PlanID]**](PlanID.md) |  | [optional] 
**currentEnrollment** | [**CurrentEnrollment**](CurrentEnrollment.md) |  | [optional] 


