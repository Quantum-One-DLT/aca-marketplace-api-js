# MarketplaceApi.MOOP

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**amount** | **Number** |  | [optional] 
**csr** | [**CostSharingReductionEnum**](CostSharingReductionEnum.md) |  | [optional] 
**familyCost** | **String** |  | [optional] 
**networkTier** | [**NetworkTierEnum**](NetworkTierEnum.md) |  | [optional] 
**type** | **String** |  | [optional] 
**individual** | **Boolean** | Applies to individuals | [optional] 
**family** | **Boolean** | Applies to families | [optional] 
**displayString** | **String** | An optional human-readable description | [optional] 


<a name="FamilyCostEnum"></a>
## Enum: FamilyCostEnum


* `individual` (value: `"Individual"`)

* `family` (value: `"Family"`)

* `familyPerPerson` (value: `"Family Per Person"`)




<a name="TypeEnum"></a>
## Enum: TypeEnum


* `medicalAndDrugEHBBenefitsTotal` (value: `"Maximum Out of Pocket for Medical and Drug EHB Benefits (Total)"`)

* `medicalEHBBenefits` (value: `"Maximum Out of Pocket for Medical EHB Benefits"`)

* `drugEHBBenefits` (value: `"Maximum Out of Pocket for Drug EHB Benefits"`)




